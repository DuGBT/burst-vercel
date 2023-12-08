import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Layout from "./App";
import { erc20TokenAbi } from "./abi/erc20token";
import { blurDepositAbi } from "./abi/blur-depositer";
import { WblurStakeAbi } from "./abi/wblur-staking";
import { useConnectWallet } from "@web3-onboard/react";
import * as ethers from "ethers";
import StakeLP from "./StakeLp";
import wBlurIcon from "./assets/wrapBlur_4.png";
import blurIcon from "./assets/blur.jpg";
import { MyContext } from "./Context";
import { getStakeWblurInfo } from "./api";
import convertIconWhite from "./assets/convert-white.svg";
import convertIcon from "./assets/convert.svg";
import unstakeIconWhite from "./assets/Unstake-white.svg";
import unstakeIcon from "./assets/Unstake.svg";
import infoIconWhite from "./assets/Info-white.svg";
import infoIcon from "./assets/Info.svg";

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
    // color: "yellow",
  },
  "&.MuiButtonBase-root.Mui-selected": {
    opacity: "1",
    color: "yellow",
  },
});

const YellowSwitch = styled(Switch)({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "yellow",
    // "&:hover": {
    //   backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    // },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "yellow",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "yellow",
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
  const { contextValue, updateContextValue } = useContext(MyContext);
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
  const [stakeInfo, setStakeInfo] = useState();
  const [advanced, setAdvanced] = useState(false);
  const handleSwitchChange = (event) => {
    setAdvanced(event.target.checked);
  };
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
          import.meta.env.VITE_WBLUR_STAKING,
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
        import.meta.env.VITE_WBLUR_STAKING,
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
        import.meta.env.VITE_WBLUR_STAKING
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
  useEffect(() => {
    async function getStakeInfo() {
      try {
        const res = await getStakeWblurInfo();
        console.log(res);
        setStakeInfo(res);
      } catch (error) {
        console.log(error);
      }
    }
    getStakeInfo();
  }, []);

  const handleChange = (e) => {
    // console.log(e.target);
  };
  const convertAndStakeApproved = !!(
    wallet &&
    blurAllowance > 0 &&
    convertAndStakeValue <= blurAllowance
  );
  const convertApproved = !!(
    wallet &&
    blurAllowance > 0 &&
    convertValue <= blurAllowance
  );
  const stakeApproved = !!(
    wallet &&
    WblurAllowance > 0 &&
    stakeInputValue <= WblurAllowance
  );
  const {
    earnedWblurValue = 0,
    stakedWblurValue = 0,
    stakedWblurCount = 0,
  } = contextValue;
  console.log(contextValue);
  return (
    <Layout>
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
            head={""}
            content={
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <img
                  src={blurIcon}
                  style={{ height: "48px", width: "48px" }}
                ></img>
                Blur
              </Stack>
            }
          ></HeadInfo>

          <HeadInfo
            head={"All Claimable"}
            content={`$${earnedWblurValue?.toFixed(2) || 0}`}
          />
          <HeadInfo
            head={"My Apr"}
            content={`${
              stakedWblurValue
                ? (
                    (earnedWblurValue / stakedWblurValue / 7) *
                    365 *
                    100
                  ).toFixed(2)
                : 0
            }%`}
          />
          <HeadInfo
            head={"Max Apr"}
            content={`${stakeInfo?.max_apr?.toFixed(2) || 0}%`}
          />
          <HeadInfo
            head={"My BLUR staked"}
            content={`${stakedWblurCount || 0} Blur = $${
              stakedWblurValue?.toFixed(2) || 0
            }`}
          />
          <HeadInfo
            head={"TVL"}
            content={`$${stakeInfo?.tvl?.toFixed(2) || 0}`}
            noBorder
          />
        </Stack>
      </Box>
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
        <StyledTab
          label={
            <Stack direction={"row"}>
              <img src={value === 2 ? infoIcon : infoIconWhite} />
              INFO
            </Stack>
          }
          sx={{
            border: "none",
            color: value === 2 ? "yellow" : "#929292",
            fontFamily: "Rajdhani SemiBold",

            fontWeight: "600",
            fontSize: "16px",
            textTransform: "none",
          }}
          onClick={() => {
            setValue(2);
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
          <Box textAlign={"left"} sx={{ color: "#fff" }}>
            advanced
            <YellowSwitch
              checked={advanced}
              onChange={handleSwitchChange}
              inputProps={{ "aria-label": "controlled" }}
            />
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
              <Box
                display={"flex"}
                position={"absolute"}
                top={6}
                right={10}
                zIndex={100}
              >
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
                <img
                  src={blurIcon}
                  style={{ width: "32px", borderRadius: "50%" }}
                />
              </Box>
              <StyledInput
                value={convertAndStakeValue === 0 ? "" : convertAndStakeValue}
                onChange={(e) => {
                  setConvertAndStakevalueValue(e.target.value);
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
                    color: convertApproved ? "#929292" : "#000",
                    background: !wallet ? "rgba(146, 146, 146, 0.2)" : "yellow",
                  }}
                >
                  1
                </Box>
              </Stack>
              {convertAndStakeApproved && (
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
              {!convertAndStakeApproved && (
                <FunctionButton
                  burstColor={wallet ? "yellow" : "black"}
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
                  background: !convertAndStakeApproved
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
                    color: convertAndStakeApproved ? "#929292" : "#000",
                    background: !convertAndStakeApproved
                      ? "rgba(146, 146, 146, 0.2)"
                      : "yellow",
                  }}
                >
                  2
                </Box>
              </Stack>
              <FunctionButton
                burstColor={
                  wallet && convertAndStakeApproved ? "yellow" : "black"
                }
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
                      import.meta.env.VITE_WBLUR_STAKING
                    );
                    console.log(res);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Convert & Stake
              </FunctionButton>
            </Box>
          </Stack>
          {advanced && (
            <Box sx={{ marginTop: "2rem" }}>
              <Box
                sx={{
                  textAlign: "left",
                }}
              >
                Or separately convert Blur into wBlur with this first form, and
                stake wBlur with this second form:
              </Box>
              <Stack
                direction={"row"}
                alignItems={"flex-end"}
                alignContent={"baseline"}
              >
                <Box width={400} position={"relative"} marginTop={5}>
                  <Box
                    position={"absolute"}
                    top={-30}
                    right={0}
                    color={"yellow"}
                  >
                    Avaliable : {userBalance}
                  </Box>
                  <Box
                    display={"flex"}
                    position={"absolute"}
                    top={6}
                    right={10}
                    zIndex={100}
                  >
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
                    <img
                      src={blurIcon}
                      style={{ width: "32px", borderRadius: "50%" }}
                    />
                  </Box>
                  <StyledInput
                    value={convertValue === 0 ? "" : convertValue}
                    onChange={(e) => {
                      setConvertValue(e.target.value);
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
                        color: convertApproved ? "#929292" : "#000",
                        background: !wallet
                          ? "rgba(146, 146, 146, 0.2)"
                          : "yellow",
                      }}
                    >
                      1
                    </Box>
                  </Stack>
                  {convertApproved && (
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
                  {!convertApproved && (
                    <FunctionButton
                      burstColor={wallet ? "yellow" : "black"}
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
                      background: !convertApproved
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
                        color: convertApproved ? "#929292" : "#000",
                        background: !convertApproved
                          ? "rgba(146, 146, 146, 0.2)"
                          : "yellow",
                      }}
                    >
                      2
                    </Box>
                  </Stack>
                  <FunctionButton
                    burstColor={wallet && convertApproved ? "yellow" : "black"}
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
                  </FunctionButton>
                </Box>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"flex-end"}
                alignContent={"baseline"}
              >
                <Box width={400} position={"relative"} marginTop={5}>
                  <Box
                    position={"absolute"}
                    top={-30}
                    right={0}
                    color={"yellow"}
                  >
                    Avaliable : {userWblurBalance}
                  </Box>
                  <Box
                    display={"flex"}
                    position={"absolute"}
                    top={6}
                    right={10}
                    zIndex={100}
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
                    <img
                      src={wBlurIcon}
                      style={{ width: "32px", borderRadius: "50%" }}
                    />
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
                        background: !wallet
                          ? "rgba(146, 146, 146, 0.2)"
                          : "yellow",
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
                          import.meta.env.VITE_WBLUR_STAKING,
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
          )}
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
              display={"flex"}
              position={"absolute"}
              top={6}
              right={10}
              zIndex={100}
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
              <img
                src={wBlurIcon}
                style={{ width: "32px", borderRadius: "50%" }}
              />
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
      <TabPanel value={value} index={2}>
        <Stack>
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box
              sx={{ marginRight: "50px", width: "300px", textAlign: "left" }}
            >
              wBlur Token Address
            </Box>
            <Box>
              <a
                style={{ color: "yellow" }}
                href={
                  "https://goerli.etherscan.io/address/0x72CebE61e70142b4B4720087aBb723182e4ca6e8"
                }
              >
                0x72CebE61e70142b4B4720087aBb723182e4ca6e8
              </a>
            </Box>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box
              sx={{ marginRight: "50px", width: "300px", textAlign: "left" }}
            >
              blur depositer
            </Box>
            <Box>
              <a
                style={{ color: "yellow" }}
                href={
                  "https://goerli.etherscan.io/address/0x4e74c4c76625d1A3f2f2285651A15580023762E6"
                }
              >
                0x4e74c4c76625d1A3f2f2285651A15580023762E6
              </a>
            </Box>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            alignContent={"baseline"}
          >
            <Box
              sx={{ marginRight: "50px", width: "300px", textAlign: "left" }}
            >
              wBlur staking contract
            </Box>
            <Box>
              <a
                style={{ color: "yellow" }}
                href={
                  "https://goerli.etherscan.io/address/0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2"
                }
              >
                0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2
              </a>
            </Box>
          </Stack>
        </Stack>
      </TabPanel>
      <StakeLP />
    </Layout>
  );
};
export default Stake;
