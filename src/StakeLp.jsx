import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { erc20TokenAbi } from "./abi/erc20token";
import { WblurStakeAbi } from "./abi/wblur-staking";
import { useConnectWallet } from "@web3-onboard/react";
import * as ethers from "ethers";
import { MyContext } from "./Context";
import { getLPPoolInfo } from "./api";
import convertIconWhite from "./assets/convert-white.svg";
import convertIcon from "./assets/convert.svg";
import unstakeIconWhite from "./assets/Unstake-white.svg";
import unstakeIcon from "./assets/Unstake.svg";
import blur from "./assets/blur.jpg";
import wBlurIcon from "./assets/wrapBlur_4.png";
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
  "&.MuiButton-root": { background: "yellow !important", width: "200px" },
});
const BlackButton = styled(Button)({
  "&.MuiButton-root": { background: "#000", width: "200px" },
});

const DisabledButton = styled(Button)({
  "&.MuiButton-root": { background: "#92929233" },
});
const GreyButton = styled(Button)({
  "&.MuiButton-root": {
    background: "rgba(146, 146, 146, 0.2)",
    width: "200px",
  },
});
const FunctionButton = (props) => {
  const { burstColor, children } = props;
  if (burstColor === "yellow") {
    return <YellowButton {...props}>{children}</YellowButton>;
  } else
    return (
      <GreyButton {...props} disabled>
        {children}
      </GreyButton>
    );
};
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
          sx={{ fontFamily: "Rajdhani Bold" }}
          fontSize={18}
          fontWeight={700}
          color={"#fff"}
        >
          {content}
        </Box>
      </Stack>
    </Box>
  );
}
function HeadInfo({ head, content, noBorder }) {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      sx={{
        borderRight: noBorder ? "none" : "1px solid #727272",
        flex: "1 1 0px",
        maxWidth: "200px",
      }}
    >
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
const StakeLP = () => {
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
  const [LPInfo, setLPINfo] = useState();

  const Header = () => {
    const { contextValue } = useContext(MyContext);
    const {
      earnedLPValue = 0,
      stakedLPCount = 0,
      stakedLPValue = 0,
    } = contextValue;
    return (
      <Box
        sx={{
          borderTop: "1px solid #727272",
          borderBottom: "1px solid #727272",
        }}
        height={100}
        padding={"10px"}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          textAlign={"left"}
          height={"100%"}
          alignItems={"center"}
        >
          <HeadInfo
            head={"pool"}
            content={
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box
                  position={"relative"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignContent={"center"}
                >
                  <img
                    style={{ height: "26px", borderRadius: "50%" }}
                    src={blur}
                  />
                  <img
                    style={{
                      height: "26px",
                      borderRadius: "50%",
                      // position: "absolute",
                      // right: "-20px",
                    }}
                    src={wBlurIcon}
                  />
                  <Box sx={{ marginLeft: "10px" }}>Blur+wBlur</Box>
                </Box>
              </Stack>
            }
          ></HeadInfo>

          <HeadInfo
            head={"All Claimable"}
            content={`$${earnedLPValue?.toFixed(2) || 0}`}
          />
          <HeadInfo
            head={"My Apr"}
            content={`${
              stakedLPValue
                ? ((earnedLPValue / stakedLPValue / 7) * 365 * 100).toFixed(2)
                : 0
            }%`}
          />
          <HeadInfo
            head={"Max Apr"}
            content={`${LPInfo?.[0]?.max_apr?.toFixed(2) || 0}%`}
          />
          <HeadInfo
            head={"My deposit"}
            content={`${stakedLPCount || 0} LP = $${
              stakedLPValue?.toFixed(2) || 0
            }`}
          />
          <HeadInfo
            head={"TVL"}
            content={`$${LPInfo?.[0]?.tvl?.toFixed(2) || 0}`}
            noBorder
          />
        </Stack>
      </Box>
    );
  };
  useEffect(() => {
    async function getLPInfo() {
      try {
        const res = await getLPPoolInfo();
        setLPINfo(res);
      } catch (error) {
        console.log(error);
      }
    }
    getLPInfo();
  }, []);

  useEffect(() => {
    async function Connect() {
      if (wallet) {
        // if using ethers v6 this is:
        // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
        const provider = new ethers.providers.Web3Provider(wallet.provider);
        const signer = await provider.getSigner();
        const Contract = new ethers.Contract(
          "0xEa542D518Ce4E6633Bbf697b089ecDEfe0A97dA6",
          erc20TokenAbi,
          provider
        );
        const WblurContract = new ethers.Contract(
          "0xEa542D518Ce4E6633Bbf697b089ecDEfe0A97dA6",
          erc20TokenAbi,
          provider
        );
        const stakeContract = new ethers.Contract(
          "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f",
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
  const approveForStake = async () => {
    try {
      const res2 = await wBlurErc20Contract.decimals();
      const res = await wBlurErc20Contract.approve(
        "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f",
        BigInt(stakeInputValue) * 10n ** BigInt(res2)
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const checkApproveForStake = async () => {
    try {
      const res = await wBlurErc20Contract.allowance(
        wallet.accounts[0].address,
        "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f"
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

      setStakeValue(Number(BigInt(res._hex) / 10n ** 16n)) / 100;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (stakeContract) checkStakeBalance();
  }, [stakeContract]);

  //   useEffect(() => {
  //     if (erc20Contract) {
  //       checkApprove();
  //       getBalance();
  //     }
  //   }, [erc20Contract]);
  useEffect(() => {
    if (wBlurErc20Contract) {
      getWblurBalance();
      checkApproveForStake();
    }
  }, [wBlurErc20Contract]);

  const handleChange = (e) => {
    // console.log(e.target);
  };
  const stakeApproved = !!(
    wallet &&
    WblurAllowance > 0 &&
    stakeInputValue <= WblurAllowance
  );
  return (
    <Box sx={{ paddingBottom: "200px" }}>
      <Box marginTop={10} textAlign={"left"}>
        Stake Curve LP Tokens
      </Box>
      <Header />

      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab
          label={
            <Stack direction={"row"}>
              <img src={value === 0 ? convertIcon : convertIconWhite} />
              CONVERT/STAKE
            </Stack>
          }
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
          label={
            <Stack direction={"row"}>
              <img src={value === 1 ? unstakeIcon : unstakeIconWhite} />
              UNSTAKE
            </Stack>
          }
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
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box width={400} position={"relative"} marginTop={5}>
              <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
                Avaliable : {userWblurBalance}
              </Box>
              <Box
                position={"absolute"}
                top={6}
                right={30}
                zIndex={100}
                display={"flex"}
              >
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
                <Box>
                  <img
                    style={{ height: "26px", borderRadius: "50%" }}
                    src={blur}
                  />
                  <img
                    style={{
                      height: "26px",
                      borderRadius: "50%",
                      position: "absolute",
                      right: "-20px",
                    }}
                    src={wBlurIcon}
                  />
                </Box>
              </Box>
              <StyledInput
                value={stakeInputValue === 0 ? "" : stakeInputValue}
                onChange={(e) => {
                  setStakeInputValue(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box>
              <Stack direction={"row"} justifyContent={"center"}>
                <Box
                  sx={{
                    marginBottom: "6px",
                    width: "20px",
                    height: "20px",
                    lineHeight: "20px",
                    textAlign: "center",
                    borderRadius: "50%",
                    color: stakeApproved ? "#929292" : "#000",
                    background: !wallet ? "rgba(146, 146, 146, 0.2)" : "yellow",
                  }}
                >
                  1
                </Box>
              </Stack>
              {stakeApproved && (
                <BlackButton
                  sx={{
                    marginX: "8px",
                    height: "41px",
                    color: "yellow !important",
                    border: "1px solid yellow",
                  }}
                  variant="contained"
                  disabled
                  onClick={() => {}}
                >
                  Approved
                </BlackButton>
              )}
              {!stakeApproved && (
                <FunctionButton
                  burstColor={wallet ? "yellow" : "black"}
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
                </FunctionButton>
              )}
            </Box>
            <Box position={"relative"}>
              <Box
                position={"absolute"}
                sx={{
                  top: "10px",
                  transform: "translate(-50%,-50%)",
                  height: "2px",
                  width: "92%",
                  background: !stakeApproved
                    ? "rgba(146, 146, 146, 0.2)"
                    : "yellow",
                }}
              ></Box>
              <Stack direction={"row"} justifyContent={"center"}>
                <Box
                  sx={{
                    marginBottom: "6px",
                    width: "20px",
                    height: "20px",
                    lineHeight: "20px",
                    textAlign: "center",
                    borderRadius: "50%",
                    color: stakeApproved ? "#929292" : "#000",
                    background: !stakeApproved
                      ? "rgba(146, 146, 146, 0.2)"
                      : "yellow",
                  }}
                >
                  2
                </Box>
              </Stack>
              <FunctionButton
                burstColor={wallet && stakeApproved ? "yellow" : "black"}
                sx={{ marginX: "8px", height: "41px", color: "#000" }}
                variant="contained"
                //   disabled
                onClick={async () => {
                  try {
                    const signer = await ethersProvider.getSigner();
                    const stakeContract = new ethers.Contract(
                      "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f",
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
              </FunctionButton>
            </Box>
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
            <Box
              position={"absolute"}
              top={6}
              right={30}
              zIndex={100}
              display={"flex"}
            >
              <Button
                onClick={() => {
                  setUnstakeValue(stakeValue);
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
              <Box>
                <img
                  style={{ height: "26px", borderRadius: "50%" }}
                  src={blur}
                />
                <img
                  style={{
                    height: "26px",
                    borderRadius: "50%",
                    position: "absolute",
                    right: "-20px",
                  }}
                  src={wBlurIcon}
                />
              </Box>
            </Box>
            <StyledInput
              value={unstakeValue === 0 ? "" : unstakeValue}
              onChange={(e) => {
                setUnstakeValue(e.target.value);
              }}
              sx={{ width: "100%" }}
            />
          </Box>

          {wallet && stakeValue > 0 && (
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
          )}
          {stakeValue === 0 && (
            <FunctionButton
              burstColor={wallet ? "yellow" : "black"}
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
            </FunctionButton>
          )}
        </Stack>
      </TabPanel>
    </Box>
  );
};
export default StakeLP;
