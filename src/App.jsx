import { useEffect, useState, useContext } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { MyContext } from "./Context";
import { styled } from "@mui/material";
import { useConnectWallet, useAccountCenter } from "@web3-onboard/react";
import { Link, useParams } from "react-router-dom";
import BurstLogo from "./assets/BURST_Logo_Yellow.png";
import * as ethers from "ethers";
import { erc20TokenAbi } from "./abi/erc20token";
import { WblurStakeAbi } from "./abi/wblur-staking";
import { getTokenPrice } from "./api";
import { LockerAbi } from "./abi/burst-locker";
import { tokenLockerAbi } from "./abi/token-locker";
import Footer from "./Footer";
import Audio from "./Audio";
import BurstIconBlack from "./assets/BURST_Icon_Black.png";

import XIcon from "./assets/x.svg";
import gitbookIcon from "./assets/gitbook.svg";
import loadingGif from "./assets/Burst_loading.gif";
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
    minWidth: "60px",
    // color: "yellow",
  },
});

const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});

function Layout({ children }) {
  const updateAccountCenter = useAccountCenter();
  const { contextValue, updateContextValue } = useContext(MyContext);
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
  const [burstLockerContract, setBurstLockerContract] = useState();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 700px)").matches
  );

  useEffect(() => {
    const audioElement = document.querySelector("#audio");
    audioElement.pause();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    updateAccountCenter({ enabled: false });

    window.addEventListener("resize", () => {
      const x = window.matchMedia("(max-width: 700px)");
      setIsMobile(x.matches);
    });
    const x = window.matchMedia("(max-width: 700px)");
    setIsMobile(x.matches);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      window.burstLoaded = true;
    }, 500);
  }, []);

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
        Object.keys(res).forEach((key) => {
          res[key.toLowerCase()] = res[key];
        });
        setTokenPrice(res);
        updateContextValue({ tokenPrice: res });
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
          import.meta.env.VITE_WBLUR_STAKING,
          WblurStakeAbi,
          provider
        );
        const stakeLPContract = new ethers.Contract(
          "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f",
          WblurStakeAbi,
          provider
        );
        const LockContract = new ethers.Contract(
          import.meta.env.VITE_BURST_LOCKER,
          LockerAbi,
          provider
        );
        const tokenLockerContract = new ethers.Contract(
          import.meta.env.VITE_TOKEN_LOCKER,
          tokenLockerAbi,
          provider
        );
        const connectedStakeContract = stakeContract.connect(signer);
        const connectedContract = Contract.connect(signer);
        const connectedWBlurContract = WblurContract.connect(signer);
        const connectedStakeLPContract = stakeLPContract.connect(signer);
        const connectedBurstLockerContract =
          tokenLockerContract.connect(signer);
        setErc20Contract(connectedContract);
        setWBlurErc20Contract(connectedWBlurContract);
        setStakeContract(connectedStakeContract);
        setStakeLPContract(connectedStakeLPContract);
        setBurstLockerContract(connectedBurstLockerContract);
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
          const stakedWblurCount =
            Number(BigInt(stakedWblurRes._hex) / 10n ** 16n) / 100;
          const stakedWblurValue =
            stakedWblurCount *
            tokenPrice[
              "0x72CebE61e70142b4B4720087aBb723182e4ca6e8".toLowerCase()
            ];

          const stakedLPRes = await stakeLPContract.balanceOf(address);
          const stakedLPCount =
            Number(BigInt(stakedLPRes._hex) / 10n ** 16n) / 100;

          const stakedLPValue =
            stakedLPCount *
              tokenPrice[
                "0xEa542D518Ce4E6633Bbf697b089ecDEfe0A97dA6".toLowerCase()
              ] || 0;

          const lockedInfoRes = await lockContract.lockedBalances(address);
          console.log(lockedInfoRes);
          const lockRes = await lockContract.lockedBalanceOf(address);
          const lockCount =
            Number(BigInt(lockedInfoRes.locked._hex) / 10n ** 16n) / 100;
          const lockValue =
            lockCount *
            tokenPrice[
              "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
            ];

          updateContextValue({
            lockedInfoRes,
            lockCount,
            lockValue,
            stakedLPCount,
            stakedLPValue,
            stakedWblurCount,
            stakedWblurValue,
          });
          setTotalDepositValue(stakedWblurValue + stakedLPValue + lockValue);
        } catch (error) {
          console.log(error);
        }
      }
    }
    getTotalDeposit();
    updateContextValue({ getTotalDeposit });
  }, [wallet, stakeContract, tokenPrice, stakeLPContract, lockContract]);

  useEffect(() => {
    async function getExtraTotalClaimable() {
      if (wallet && stakeContract && tokenPrice) {
        const address = wallet.accounts[0].address;
        try {
          const stakedWblurRes = await stakeContract.extraRewardsLength();

          const stakedWblurExtraRewardsLength = Number(
            BigInt(stakedWblurRes._hex)
          );
          let stakedWblurExtraTotalValue = 0;
          const stakedWblurExtraRewardInfo = [];
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
            const extraRewardCount =
              Number(BigInt(extraRewardRes._hex) / 10n ** 16n) / 100;
            const extraRewardValue =
              extraRewardCount * tokenPrice[extraRewardTokenAddress];
            stakedWblurExtraTotalValue += extraRewardValue || 0;
            stakedWblurExtraRewardInfo.push({
              tokenAddress: extraRewardTokenAddress,
              amount: extraRewardCount,
              value: extraRewardValue,
            });
          }

          const stakedLPRes = await stakeLPContract.extraRewardsLength();

          const stakedLPExtraRewardsLength = Number(BigInt(stakedLPRes._hex));
          const stakedLPExtraRewardInfo = [];

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
            const extraRewardCount =
              Number(BigInt(extraRewardRes._hex) / 10n ** 16n) / 100;

            const extraRewardValue =
              extraRewardCount * tokenPrice[extraRewardTokenAddress];
            stakedLPExtraTotalValue += extraRewardValue || 0;
            stakedLPExtraRewardInfo.push({
              tokenAddress: extraRewardTokenAddress,
              amount: extraRewardCount,
              value: extraRewardValue,
            });
          }
          updateContextValue({
            stakedLPExtraTotalValue,
            stakedWblurExtraTotalValue,
            stakedWblurExtraRewardInfo,
            stakedLPExtraRewardInfo,
          });
          return stakedLPExtraTotalValue + stakedWblurExtraTotalValue;
        } catch (error) {
          console.log(error);
        }
      }
    }
    async function getTotalClaimable() {
      if (wallet && tokenPrice) {
        const address = wallet.accounts[0].address;
        try {
          const stakedWblurRes = await stakeContract.earned(address);
          console.log(stakedWblurRes);
          const earnedWblurCount =
            Number(BigInt(stakedWblurRes._hex) / 10n ** 16n) / 100;
          const earnedWblurValue =
            earnedWblurCount *
            tokenPrice[
              "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
            ];

          const stakedLPRes = await stakeLPContract.earned(address);

          const earnedLPCount =
            Number(BigInt(stakedLPRes._hex) / 10n ** 16n) / 100;
          console.log(earnedLPCount, earnedWblurValue, "earn lp");
          const earnedLPValue =
            earnedLPCount *
              tokenPrice[
                "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
              ] || 0;

          const lockRes = await lockContract.claimableRewards(address);

          const lockClaimableTokens = lockRes.map((res) => {
            return {
              address: res[0].toLowerCase(),
              count: Number(BigInt(res[1]._hex) / 10n ** 16n) / 100,
              value:
                (Number(BigInt(res[1]._hex) / 10n ** 16n) / 100) *
                  tokenPrice[res[0].toLowerCase()] || 0,
            };
          });
          console.log(lockRes, lockClaimableTokens);
          const lockEarnedValue = lockClaimableTokens.reduce((sum, token) => {
            return sum + token.value;
          }, 0);

          const burstBalanceInLockerRes =
            await burstLockerContract.lockedBalances(address);

          const releasableBalanceRes =
            await burstLockerContract.releasableBalanceOf(address);
          const lockerBalanceRes = await burstLockerContract.balanceOf(address);

          const releasableBalance =
            Number(BigInt(releasableBalanceRes._hex) / 10n ** 16n) / 100;
          const releasableValue =
            releasableBalance *
              tokenPrice[
                "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
              ] || 0;

          const tokenLockerBalance =
            Number(BigInt(lockerBalanceRes._hex) / 10n ** 16n) / 100;

          const tokenLockerValue =
            tokenLockerBalance *
              tokenPrice[
                "0x0535a470f39dec973c15d2aa6e7f968235f6e1d4".toLowerCase()
              ] || 0;
          const extraValue = await getExtraTotalClaimable();
          setTotalClaimableValue(
            lockEarnedValue +
              earnedLPValue +
              earnedWblurValue +
              extraValue +
              releasableValue
          );
          updateContextValue({
            releasableBalance,
            releasableValue,
            tokenLockerBalance: tokenLockerBalance - releasableBalance,
            tokenLockerValue: tokenLockerValue - releasableValue,
            lockClaimableTokens,
            lockEarnedValue,
            earnedLPCount,
            earnedLPValue,
            earnedWblurCount,
            earnedWblurValue,
            burstBalanceInLockerRes,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    getTotalClaimable();
    updateContextValue({
      getTotalClaimable,
    });
  }, [
    wallet,
    stakeContract,
    tokenPrice,
    stakeLPContract,
    lockContract,
    burstLockerContract,
  ]);

  if (loading && !window.burstLoaded) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "48%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <img style={{ width: "64px" }} src={loadingGif} />
      </Box>
    );
  }

  return (
    <Box id="layout-box" position={"relative"} sx={{ minHeight: "100vh" }}>
      <div className="header">
        <Box
          sx={{
            background: "#000",
            position: "relative",
          }}
        >
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Box
              sx={{
                flex: "0 1 300px",
                cursor: "pointer",
                minWidth: isMobile ? "40px" : "146px",
                maxWidth: "300px",
              }}
            >
              <Link to="/" style={{ width: "100%" }}>
                <img
                  src={isMobile ? BurstIconBlack : BurstLogo}
                  style={{
                    maxWidth: isMobile ? "40px" : "300px",
                    width: "100%",
                  }}
                />
              </Link>
            </Box>
            <Stack
              sx={{ flex: "0 1 240px", marginRight: "1rem" }}
              width={"100%"}
              direction={"row"}
              justifyContent={"center"}
              // alignItems={"center"}
            >
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
                      paddingRight: isMobile ? "0" : "12px",
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
                      paddingRight: isMobile ? "0" : "12px",
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
                      paddingRight: isMobile ? "0" : "12px",
                    }}
                  />
                </Link>
              </StyledTabs>
            </Stack>
            <Box
              sx={{
                flex: "0 1 300px",
                display: "flex",
                flexDirection: "row-reverse",
                paddingRight: "1rem",
              }}
            >
              <YellowButton
                sx={{
                  background: "yellow",
                  fontFamily: "Rajdhani Bold",
                  color: "#000",
                  height: "36px",
                  minWidth: "106px",
                  // position: "absolute",
                  // right: "0",
                  // top: "0",
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
            </Box>
          </Stack>
          <Stack
            // sx={{ marginTop: "40px" }}
            direction={"row"}
            justifyContent={"center"}
          >
            <Box
              minHeight={50}
              sx={{
                backgroundColor: "rgba(45, 45, 45, 0.8)",
                color: "yellow",
                width: 300,
                height: 100,
                borderRadius: 4,
                m: "30px",
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
                m: "30px",
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
        paddingBottom={"100px"}
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
          <Paper elevation={3} sx={{ m: 1, background: "#000" }}>
            <Box
              sx={{
                // minHeight: "100vh",
                width: "100%",
                bgcolor: "#000",
                color: "#929292",
              }}
            >
              {children}
            </Box>
          </Paper>
        </Box>
      </Box>
      <Footer></Footer>
      {/* <Audio /> */}
    </Box>
  );
}

export default Layout;
