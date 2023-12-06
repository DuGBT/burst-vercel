import { useEffect, useState } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { useConnectWallet } from "@web3-onboard/react";
import { Link, useParams } from "react-router-dom";
import BurstLogo from "./assets/BURST_Logo_Yellow.png";
import * as ethers from "ethers";
import { erc20TokenAbi } from "./abi/erc20token";
import { WblurStakeAbi } from "./abi/wblur-staking";
import { getTokenPrice } from "./api";
import { LockerAbi } from "./abi/burst-locker";

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none",
    transition: "none",
  },
});

const StyledTab = styled(Tab)({
  "&:focus": {
    outline: "none",
  },
  "&.MuiButtonBase-root": {
    opacity: "1",
    // color: "yellow",
  },
});

const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});

function Layout({ children }) {
  const [value, setValue] = useState(0);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [stakeContract, setStakeContract] = useState();
  const [stakeLPContract, setStakeLPContract] = useState();
  const [ethersProvider, setProvider] = useState();
  const [erc20Contract, setErc20Contract] = useState();
  const [wBlurErc20Contract, setWBlurErc20Contract] = useState();
  const [lockContract, setLockContract] = useState();
  const [totalDepositValue, setTotalDepositValue] = useState(0);
  const [totalClaimableValue, setTotalClaimableValue] = useState(0);
  const [tokenPrice, setTokenPrice] = useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const name = window.location.pathname;

    if (name === "/stake") {
      setValue(0);
    }
    if (name === "/claim") {
      setValue(1);
    }
    if (name === "/lock") {
      setValue(2);
    }
  }, []);
  useEffect(() => {
    async function getPrice() {
      try {
        const res = await getTokenPrice();
        console.log(res);
        Object.keys(res).forEach((key) => {
          res[key.toLowerCase()] = res[key];
        });
        setTokenPrice(res);
      } catch (error) {
        console.log(error);
      }
    }
    getPrice();
  }, []);

  useEffect(() => {
    async function Connect() {
      if (wallet) {
        const provider = new ethers.providers.Web3Provider(wallet.provider);
        const signer = await provider.getSigner();
        const Contract = new ethers.Contract(
          "0xBC27067AbcCb83962e8DcbC393132E482e85E2C7",
          erc20TokenAbi,
          provider
        );
        const WblurContract = new ethers.Contract(
          "0x72cebe61e70142b4b4720087abb723182e4ca6e8",
          erc20TokenAbi,
          provider
        );
        const stakeContract = new ethers.Contract(
          "0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2",
          WblurStakeAbi,
          provider
        );
        const stakeLPContract = new ethers.Contract(
          "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f",
          WblurStakeAbi,
          provider
        );
        const LockContract = new ethers.Contract(
          "0x8aEE0D7dd5024bF6430d30D4eAD90f8903e724A9",
          LockerAbi,
          provider
        );
        const connectedStakeContract = stakeContract.connect(signer);
        const connectedContract = Contract.connect(signer);
        const connectedWBlurContract = WblurContract.connect(signer);
        const connectedStakeLPContract = stakeLPContract.connect(signer);
        setErc20Contract(connectedContract);
        setWBlurErc20Contract(connectedWBlurContract);
        setStakeContract(connectedStakeContract);
        setStakeLPContract(connectedStakeLPContract);
        setLockContract(LockContract.connect(signer));

        setProvider(provider);
      }
    }
    Connect();
  }, [wallet]);

  useEffect(() => {
    async function getTotalDeposit() {
      if (wallet && tokenPrice) {
        const address = wallet.accounts[0].address;
        try {
          const stakedWblurRes = await stakeContract.balanceOf(address);
          console.log(
            Number(BigInt(stakedWblurRes._hex) / 10n ** 18n),
            "deposit"
          );
          const stakedWblurCount = Number(
            BigInt(stakedWblurRes._hex) / 10n ** 18n
          );
          const stakedWblurValue =
            stakedWblurCount *
            tokenPrice[
              "0x72CebE61e70142b4B4720087aBb723182e4ca6e8".toLowerCase()
            ];
          console.log(stakedWblurValue);

          const stakedLPRes = await stakeLPContract.balanceOf(address);
          console.log(Number(BigInt(stakedLPRes._hex) / 10n ** 18n), "deposit");
          const stakedLPCount = Number(BigInt(stakedLPRes._hex) / 10n ** 18n);
          const stakedLPValue =
            stakedLPCount *
              tokenPrice[
                "0xEa542D518Ce4E6633Bbf697b089ecDEfe0A97dA6".toLowerCase()
              ] || 0;
          console.log(stakedLPValue);

          const lockRes = await lockContract.lockedBalanceOf(address);
          console.log(Number(BigInt(lockRes._hex) / 10n ** 18n), "deposit");
          const lockCount = Number(BigInt(lockRes._hex) / 10n ** 18n);
          const lockValue =
            lockCount *
            tokenPrice[
              "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
            ];
          console.log(lockValue);

          setTotalDepositValue(stakedWblurValue + stakedLPValue + lockValue);
        } catch (error) {
          console.log(error);
        }
      }
    }
    getTotalDeposit();
  }, [wallet, stakeContract, tokenPrice, stakeLPContract, lockContract]);

  useEffect(() => {
    async function getExtraTotalClaimable() {
      if (wallet && tokenPrice) {
        const address = wallet.accounts[0].address;
        try {
          const stakedWblurRes = await stakeContract.extraRewardsLength();
          console.log(Number(BigInt(stakedWblurRes._hex)), "extra");

          const stakedWblurExtraRewardsLength = Number(
            BigInt(stakedWblurRes._hex)
          );
          let stakedWblurExtraTotalValue = 0;
          for (let i = 0; i < stakedWblurExtraRewardsLength; i++) {
            const rewardContractAddress = await stakeContract.extraRewards(i);
            const rewardContract = new ethers.Contract(
              rewardContractAddress,
              WblurStakeAbi,
              ethersProvider
            );
            const signer = ethersProvider.getSigner();
            const connectedRewardContract = rewardContract.connect(signer);
            const extraRewardRes = await connectedRewardContract.earned(
              address
            );
            const extraRewardTokenAddress =
              await connectedRewardContract.rewardToken();
            console.log(extraRewardRes, extraRewardTokenAddress);
            const extraRewardCount = Number(
              BigInt(extraRewardRes._hex) / 10n ** 18n
            );
            const extraRewardValue =
              extraRewardCount * tokenPrice[extraRewardTokenAddress];
            console.log(extraRewardValue, "extra reward");
            stakedWblurExtraTotalValue += extraRewardValue || 0;
          }
          const stakedLPRes = await stakeLPContract.extraRewardsLength();
          console.log(
            Number(BigInt(stakedLPRes._hex)),
            "extra LP",
            stakedLPRes
          );

          const stakedLPExtraRewardsLength = Number(BigInt(stakedLPRes._hex));
          let stakedLPExtraTotalValue = 0;
          for (let i = 0; i < stakedLPExtraRewardsLength; i++) {
            const rewardContractAddress = await stakeLPContract.extraRewards(i);
            const rewardContract = new ethers.Contract(
              rewardContractAddress,
              WblurStakeAbi,
              ethersProvider
            );
            const signer = ethersProvider.getSigner();
            const connectedRewardContract = rewardContract.connect(signer);
            const extraRewardRes = await connectedRewardContract.earned(
              address
            );
            const extraRewardTokenAddress =
              await connectedRewardContract.rewardToken();
            console.log(extraRewardRes, extraRewardTokenAddress);
            const extraRewardCount = Number(
              BigInt(extraRewardRes._hex) / 10n ** 18n
            );
            const extraRewardValue =
              extraRewardCount * tokenPrice[extraRewardTokenAddress];
            console.log(extraRewardValue, "extra reward");
            stakedLPExtraTotalValue += extraRewardValue || 0;
          }
          return stakedLPExtraTotalValue + stakedWblurExtraTotalValue;
        } catch (error) {
          console.log(error);
        }
      }
    }
    async function getTotalClaimable() {
      console.log(wallet && tokenPrice, "claim?");
      if (wallet && tokenPrice) {
        const address = wallet.accounts[0].address;
        try {
          const stakedWblurRes = await stakeContract.earned(address);
          console.log(
            Number(BigInt(stakedWblurRes._hex) / 10n ** 18n),
            "claimable"
          );
          const stakedWblurCount = Number(
            BigInt(stakedWblurRes._hex) / 10n ** 18n
          );
          const stakedWblurValue =
            stakedWblurCount *
            tokenPrice[
              "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
            ];
          console.log(stakedWblurValue);

          const stakedLPRes = await stakeLPContract.earned(address);
          console.log(
            Number(BigInt(stakedLPRes._hex) / 10n ** 18n),
            "claimable"
          );
          const stakedLPCount = Number(BigInt(stakedLPRes._hex) / 10n ** 18n);
          const stakedLPValue =
            stakedLPCount *
              tokenPrice[
                "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
              ] || 0;
          console.log(stakedLPValue);

          const lockRes = await lockContract.claimableRewards(address);
          console.log(lockRes, "claimable");
          const lockClaimableTokens = lockRes.map((res) => {
            return {
              address: res[0].toLowerCase(),
              count: Number(BigInt(res[1]._hex) / 10n ** 18n),
              value:
                Number(BigInt(res[1]._hex) / 10n ** 18n) *
                  tokenPrice[res[0].toLowerCase()] || 0,
            };
          });
          console.log(lockClaimableTokens);
          // const lockCount =;
          const lockValue = lockClaimableTokens.reduce((sum, token) => {
            return sum + token.value;
          }, 0);
          console.log(lockValue);
          const extraValue = await getExtraTotalClaimable();
          setTotalClaimableValue(
            lockValue + stakedLPValue + stakedWblurValue + extraValue
          );
          console.log(lockValue, stakedLPValue, stakedWblurValue, extraValue),
            "totalvalue";
        } catch (error) {
          console.log(error);
        }
      }
    }
    getTotalClaimable();
  }, [wallet, stakeContract, tokenPrice, stakeLPContract, lockContract]);

  return (
    <div>
      <div className="header">
        <Box
          sx={{
            background: "#000",
            height: 200,
            p: 0,
            position: "relative",
          }}
        >
          <Box sx={{ position: "absolute", top: "0" }}>
            <img src={BurstLogo} style={{ width: "300px" }} />
          </Box>
          <YellowButton
            sx={{
              background: "yellow",
              fontFamily: "Rajdhani Bold",
              color: "#000",
              position: "absolute",
              right: "0",
              top: "0",
            }}
            onClick={() => {
              wallet ? disconnect(wallet) : connect();
            }}
          >
            {wallet
              ? `${wallet.accounts[0].address.slice(
                  0,
                  6
                )}...${wallet.accounts[0].address.slice(-4)}`
              : "Connect Wallet"}
          </YellowButton>
          <Stack width={"100%"} direction={"row"} justifyContent={"center"}>
            <StyledTabs value={value} onChange={handleChange} centered>
              <Link to={"/stake"}>
                <StyledTab
                  label="Stake"
                  disableTouchRipple
                  sx={{
                    border: "none",
                    fontWeight: "700",
                    fontSize: "16px",
                    textTransform: "none",
                    color:
                      window.location.pathname === "/stake"
                        ? "yellow"
                        : "#929292",
                  }}
                />
              </Link>
              <Link to={"/claim"}>
                <StyledTab
                  label="Claim"
                  disableTouchRipple
                  sx={{
                    border: "none",
                    color:
                      window.location.pathname === "/claim"
                        ? "yellow"
                        : "#929292",

                    fontWeight: "700",
                    fontSize: "16px",
                    textTransform: "none",
                  }}
                />
              </Link>
              <Link to={"/lock"}>
                <StyledTab
                  label="Lock"
                  disableTouchRipple
                  sx={{
                    border: "none",
                    color:
                      window.location.pathname === "/lock"
                        ? "yellow"
                        : "#929292",
                    fontWeight: "700",
                    fontSize: "16px",
                    textTransform: "none",
                  }}
                />
              </Link>
            </StyledTabs>
          </Stack>
          <Stack direction={"row"} justifyContent={"center"}>
            <Box
              minHeight={50}
              sx={{
                backgroundColor: "rgba(45, 45, 45, 0.8)",
                color: "yellow",
                width: 300,
                height: 100,
                borderRadius: 4,
                m: "10px",
                paddingTop: "20px",
              }}
            >
              <Box sx={{ fontWeight: 700, fontSize: "16px" }}>
                Total Claimable
              </Box>
              <Box
                sx={{
                  // fontFamily: "'Rajdhani'",
                  fontSize: "36px",
                  fontWeight: "500",
                  lineHeight: "46px",
                  letterSpacing: "0em",
                  textAlign: "center",
                  textShadow: "0px 0px 6px #FCFC03CC",
                }}
              >
                {`$${totalClaimableValue.toFixed(2)}`}
              </Box>
            </Box>
            <Box
              minHeight={50}
              sx={{
                backgroundColor: "rgba(45, 45, 45, 0.8)",
                color: "yellow",
                width: 300,
                height: 100,
                borderRadius: 4,
                m: "10px",
                paddingTop: "20px",
              }}
            >
              <Box sx={{ fontWeight: 700, fontSize: "16px" }}>
                Total Deposit
              </Box>
              <Box
                sx={{
                  fontSize: "36px",
                  fontWeight: "500",
                  lineHeight: "46px",
                  letterSpacing: "0em",
                  textAlign: "center",
                  textShadow: "0px 0px 6px #FCFC03CC",
                }}
              >
                {`$${totalDepositValue.toFixed(2)}`}
              </Box>
            </Box>
          </Stack>
        </Box>
      </div>
      <Box
        position={"relative"}
        // height={800}
      >
        <Box
          position={"absolute"}
          top={-10}
          height={72}
          backgroundColor={"#000"}
          width={"100%"}
        ></Box>
        <Box
          maxWidth={"1200px"}
          margin={"0 auto"}
          position={"relative"}
          zIndex={1}
        >
          <Paper elevation={3} sx={{ height: 600, m: 1, background: "#000" }}>
            <Box sx={{ width: "100%", bgcolor: "#000", color: "#929292" }}>
              {children}
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default Layout;
