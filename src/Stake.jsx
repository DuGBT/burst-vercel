import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Layout from "./App";
import { erc20TokenAbi } from "./abi/erc20token";
import { blurDepositAbi } from "./abi/blur-depositer";
import { WblurStakeAbi } from "./abi/wblur-staking";
import { useConnectWallet } from "@web3-onboard/react";
import * as ethers from "ethers";
import StakeLP from "./StakeLp";
const StyledInput = styled(TextField)({
  "& .MuiInputBase-input": {
    padding: "10px",
    paddingTop: "8px",
    border: "1px solid #C3D4A58D",
    color: "#fff",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #C3D4A5 !important",
  },
  "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #C3D4A58D",
  },
});
const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});
const BlackButton = styled(Button)({
  "&.MuiButton-root": { background: "#000" },
});

function HeadInfoItem({ head, content }) {
  return (
    <Box>
      <Stack>
        <Box
          sx={{ opacity: 0.5 }}
          fontSize={15}
          fontWeight={500}
          color={"#fff"}
        >
          {head}
        </Box>
        <Box
          sx={{ fontFamily: "Rajdhani SemiBold" }}
          fontSize={17}
          fontWeight={700}
          color={"#fff"}
        >
          {content}
        </Box>
      </Stack>
    </Box>
  );
}
function HeadInfo({ head, content }) {
  return (
    <Box>
      <HeadInfoItem head={head} content={content}></HeadInfoItem>
    </Box>
  );
}
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
  "&.MuiButtonBase-root.Mui-selected": {
    opacity: "1",
    color: "yellow",
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Stake = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [value, setValue] = useState(0);
  const [convertAndStakeValue, setConvertAndStakevalueValue] = useState(0);
  const [blurAllowance, setBlurAllowance] = useState(0);
  const [WblurAllowance, setWBlurAllowance] = useState(0);

  const [convertValue, setConvertValue] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);
  const [stakeInputValue, setStakeInputValue] = useState(0);
  const [stakeContract, setStakeContract] = useState();
  const [ethersProvider, setProvider] = useState();
  const [erc20Contract, setErc20Contract] = useState();
  const [wBlurErc20Contract, setWBlurErc20Contract] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [userWblurBalance, setUserWblurBalance] = useState(0);
  const [unstakeValue, setUnstakeValue] = useState(0);
  useEffect(() => {
    async function Connect() {
      if (wallet) {
        // if using ethers v6 this is:
        // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
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
          ethersProvider
        );
        const connectedStakeContract = stakeContract.connect(signer);
        const connectedContract = Contract.connect(signer);
        const connectedWBlurContract = WblurContract.connect(signer);
        setErc20Contract(connectedContract);
        setWBlurErc20Contract(connectedWBlurContract);
        setStakeContract(connectedStakeContract);
        setProvider(provider);
      }
    }
    Connect();
  }, [wallet]);

  const getBalance = async () => {
    try {
      const res = await erc20Contract.balanceOf(wallet.accounts[0].address);
      const res2 = await erc20Contract.decimals();
      setUserBalance(Number(BigInt(res._hex) / 10n ** BigInt(res2)));
    } catch (error) {
      console.log(error);
    }
  };
  const getWblurBalance = async () => {
    try {
      const res = await wBlurErc20Contract.balanceOf(
        wallet.accounts[0].address
      );
      const res2 = await wBlurErc20Contract.decimals();
      setUserWblurBalance(Number(BigInt(res._hex) / 10n ** BigInt(res2)));
    } catch (error) {
      console.log(error);
    }
  };
  const approve = async () => {
    try {
      const res2 = await erc20Contract.decimals();

      const res = await erc20Contract.approve(
        "0x4e74c4c76625d1A3f2f2285651A15580023762E6",
        BigInt(userBalance) * 10n ** BigInt(res2)
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const approveForStake = async () => {
    try {
      const res2 = await wBlurErc20Contract.decimals();
      const res = await wBlurErc20Contract.approve(
        "0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2",
        BigInt(userWblurBalance) * 10n ** BigInt(res2)
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const checkApprove = async () => {
    try {
      const res = await erc20Contract.allowance(
        wallet.accounts[0].address,
        "0x4e74c4c76625d1A3f2f2285651A15580023762E6"
      );
      setBlurAllowance(Number(BigInt(res._hex) / 10n ** 18n));
      console.log("allowance", Number(BigInt(res._hex) / 10n ** 18n));
      if (res == 0) {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkApproveForStake = async () => {
    try {
      const res = await wBlurErc20Contract.allowance(
        wallet.accounts[0].address,
        "0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2"
      );
      setWBlurAllowance(Number(BigInt(res._hex) / 10n ** 18n));
      if (res == 0) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkStakeBalance = async () => {
    try {
      const res = await stakeContract.balanceOf(wallet.accounts[0].address);
      console.log(res, "stake value", Number(BigInt(res._hex) / 10n ** 18n));
      setStakeValue(Number(BigInt(res._hex) / 10n ** 18n));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (stakeContract) checkStakeBalance();
  }, [stakeContract]);

  useEffect(() => {
    if (erc20Contract) {
      checkApprove();
      getBalance();
    }
  }, [erc20Contract]);
  useEffect(() => {
    if (wBlurErc20Contract) {
      getWblurBalance();
      checkApproveForStake();
    }
  }, [wBlurErc20Contract]);

  const handleChange = (e) => {
    console.log(e.target);
  };
  return (
    <Layout>
      <Box backgroundColor={"rgb(42, 42, 42)"} height={100} padding={"10px"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          textAlign={"left"}
        >
          <HeadInfo head={"All Claimable"} content={"$0"} />
          <HeadInfo head={"My vApr"} content={"0%"} />
          <HeadInfo head={"Max vApr"} content={"19%"} />
          <HeadInfo head={"My cvxCRV staked"} content={"0  cvxCrv = $0"} />
          <HeadInfo head={"TVL"} content={"$130m"} />
        </Stack>
      </Box>
      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab
          label="CONVERT/STAKE"
          sx={{
            fontFamily: "Rajdhani SemiBold",
            border: "none",
            fontWeight: "600",
            fontSize: "16px",
            textTransform: "none",
            color: value === 0 ? "yellow" : "#929292",
          }}
          onClick={() => {
            setValue(0);
          }}
        />
        <StyledTab
          label="UNSTAKE"
          sx={{
            border: "none",
            color: value === 1 ? "yellow" : "#929292",
            fontFamily: "Rajdhani SemiBold",

            fontWeight: "600",
            fontSize: "16px",
            textTransform: "none",
          }}
          onClick={() => {
            setValue(1);
          }}
        />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <Box>
          <Box sx={{ fontWeight: "500", textAlign: "left" }}>
            Transform your $BLUR into wBLUR. When you stake wBLUR, you gain the
            standard points associated with Blur staking, including the future
            $BLUR and $BLAST airdrops. In addition, you receive $BURST tokens.
          </Box>
          <Box sx={{ fontWeight: "500", textAlign: "left" }}>
            WARNING: The process of changing BLUR into wBLUR cannot be reversed.
            While it's possible to stake and unstake wBLUR tokens, reconverting
            them into $BLUR is not an option. Nonetheless, secondary markets are
            available where wBLUR can be traded for BLUR, though the exchange
            rates may vary. It is possible to convert wBLUR back to BLUR if a
            DAO vote passes in favor of this action.
          </Box>
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box width={400} position={"relative"} marginTop={5}>
              <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
                Avaliable : {userBalance}
              </Box>
              <Box position={"absolute"} top={6} right={10} zIndex={100}>
                <Button
                  onClick={() => {
                    setConvertAndStakevalueValue(userBalance);
                  }}
                  sx={{
                    height: "30px",
                    width: "40px",
                    padding: 0,
                    minWidth: "30px",
                    background: "#C3D4A54D",
                    color: "#c3d4a5",
                  }}
                >
                  Max
                </Button>
              </Box>
              <StyledInput
                value={convertAndStakeValue === 0 ? "" : convertAndStakeValue}
                onChange={(e) => {
                  setConvertAndStakevalueValue(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Box>
            {blurAllowance > 0 && convertAndStakeValue <= blurAllowance && (
              <BlackButton
                sx={{
                  marginX: "8px",
                  height: "41px",
                  color: "yellow",
                  border: "1px solid yellow",
                }}
                variant="contained"
                onClick={() => {
                  //   approve();
                }}
              >
                Approved
              </BlackButton>
            )}
            {(blurAllowance === 0 || convertAndStakeValue > blurAllowance) && (
              <YellowButton
                sx={{
                  marginX: "8px",
                  height: "41px",
                  color: "#000",
                }}
                variant="contained"
                onClick={() => {
                  approve();
                }}
              >
                Approve
              </YellowButton>
            )}
            <YellowButton
              sx={{ marginX: "8px", height: "41px", color: "#000" }}
              variant="contained"
              //   disabled
              onClick={async () => {
                try {
                  const signer = await ethersProvider.getSigner();
                  const Contract = new ethers.Contract(
                    "0x4e74c4c76625d1A3f2f2285651A15580023762E6",
                    blurDepositAbi,
                    ethersProvider
                  );
                  const connectedContract = Contract.connect(signer);

                  const res = await connectedContract.deposit(
                    BigInt(convertAndStakeValue) * 10n ** 18n,
                    "0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2"
                  );
                  console.log(res);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Convert & Stake
            </YellowButton>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box width={400} position={"relative"} marginTop={5}>
              <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
                Avaliable : {userBalance}
              </Box>
              <Box position={"absolute"} top={6} right={10} zIndex={100}>
                <Button
                  onClick={() => {
                    setConvertValue(userBalance);
                  }}
                  sx={{
                    height: "30px",
                    width: "40px",
                    padding: 0,
                    minWidth: "30px",
                    background: "#C3D4A54D",
                    color: "#c3d4a5",
                  }}
                >
                  Max
                </Button>
              </Box>
              <StyledInput
                value={convertValue === 0 ? "" : convertValue}
                onChange={(e) => {
                  setConvertValue(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Box>

            {blurAllowance > 0 && convertValue <= blurAllowance && (
              <BlackButton
                sx={{
                  marginX: "8px",
                  height: "41px",
                  color: "yellow",
                  border: "1px solid yellow",
                }}
                variant="contained"
                onClick={() => {}}
              >
                Approved
              </BlackButton>
            )}
            {(blurAllowance === 0 || convertValue > blurAllowance) && (
              <YellowButton
                sx={{
                  marginX: "8px",
                  height: "41px",
                  color: "#000",
                }}
                variant="contained"
                onClick={() => {
                  approve();
                }}
              >
                Approve
              </YellowButton>
            )}
            <YellowButton
              sx={{ marginX: "8px", height: "41px", color: "#000" }}
              variant="contained"
              //   disabled
              onClick={async () => {
                try {
                  const signer = await ethersProvider.getSigner();
                  const Contract = new ethers.Contract(
                    "0x4e74c4c76625d1A3f2f2285651A15580023762E6",
                    blurDepositAbi,
                    ethersProvider
                  );
                  const connectedContract = Contract.connect(signer);

                  const res = await connectedContract.deposit(
                    BigInt(convertValue) * 10n ** 18n,
                    "0x0000000000000000000000000000000000000000"
                  );
                  console.log(res);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Convert
            </YellowButton>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box width={400} position={"relative"} marginTop={5}>
              <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
                Avaliable : {userWblurBalance}
              </Box>
              <Box position={"absolute"} top={6} right={10} zIndex={100}>
                <Button
                  onClick={() => {
                    setStakeInputValue(userWblurBalance);
                  }}
                  sx={{
                    height: "30px",
                    width: "40px",
                    padding: 0,
                    minWidth: "30px",
                    background: "#C3D4A54D",
                    color: "#c3d4a5",
                  }}
                >
                  Max
                </Button>
              </Box>
              <StyledInput
                value={stakeInputValue === 0 ? "" : stakeInputValue}
                onChange={(e) => {
                  setStakeInputValue(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Box>
            {WblurAllowance > 0 && stakeInputValue <= WblurAllowance && (
              <BlackButton
                sx={{
                  marginX: "8px",
                  height: "41px",
                  color: "yellow",
                  border: "1px solid yellow",
                }}
                variant="contained"
                onClick={() => {}}
              >
                Approved
              </BlackButton>
            )}
            {(WblurAllowance === 0 || stakeInputValue > WblurAllowance) && (
              <YellowButton
                sx={{
                  marginX: "8px",
                  height: "41px",
                  color: "#000",
                }}
                variant="contained"
                onClick={() => {
                  approveForStake();
                }}
              >
                Approve
              </YellowButton>
            )}
            <YellowButton
              sx={{ marginX: "8px", height: "41px", color: "#000" }}
              variant="contained"
              //   disabled
              onClick={async () => {
                try {
                  const signer = await ethersProvider.getSigner();
                  const stakeContract = new ethers.Contract(
                    "0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2",
                    WblurStakeAbi,
                    ethersProvider
                  );
                  const connectedContract = stakeContract.connect(signer);

                  const res = await connectedContract.stake(
                    BigInt(stakeInputValue) * 10n ** 18n
                  );
                  console.log(res);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Stake
            </YellowButton>
          </Stack>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Stack
          direction={"row"}
          alignItems={"flex-end"}
          alignContent={"baseline"}
        >
          <Box width={400} position={"relative"} marginTop={5}>
            <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
              staked : {stakeValue}
            </Box>

            <StyledInput
              value={unstakeValue === 0 ? "" : convertAndStakeValue}
              onChange={(e) => {
                setUnstakeValue(e.target.value);
              }}
              sx={{ width: "100%" }}
            />
          </Box>

          <YellowButton
            sx={{ marginX: "8px", height: "41px", color: "#000" }}
            variant="contained"
            //   disabled
            onClick={async () => {
              try {
                const res = await stakeContract.withdraw(
                  BigInt(unstakeValue) * 10n ** 18n,
                  true
                );
                console.log(res);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            UNSTAKE
          </YellowButton>
        </Stack>
      </TabPanel>
      <StakeLP />
    </Layout>
  );
};
export default Stake;
