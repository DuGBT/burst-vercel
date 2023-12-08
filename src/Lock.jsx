import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Layout from "./App";
import { useState, useEffect, useContext } from "react";
import { erc20TokenAbi } from "./abi/erc20token";
import { LockerAbi } from "./abi/burst-locker";
import { useConnectWallet } from "@web3-onboard/react";
import * as ethers from "ethers";
import burstIcon from "./assets/BURST_Icon_Black.png";
import { getLockInfo } from "./api";
import { MyContext } from "./Context";

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
  } else return <GreyButton {...props}>{children}</GreyButton>;
};
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
const Lock = () => {
  const { contextValue, updateContextValue } = useContext(MyContext);
  const [lockValue, setLockValue] = useState(0);
  const [lockInfo, setLockInfo] = useState();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [erc20Contract, setErc20Contract] = useState();
  const [allowance, setAllowance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [lockContract, setLockContract] = useState();
  console.log(contextValue);
  useEffect(() => {
    if (erc20Contract) {
      getBalance();
      checkApprove();
    }
  }, [erc20Contract]);

  useEffect(() => {
    async function getLockBurstInfo() {
      try {
        const res = await getLockInfo();
        setLockInfo(res);
      } catch (error) {
        console.log(error);
      }
    }
    getLockBurstInfo();
  }, []);

  const approve = async () => {
    try {
      const res2 = await erc20Contract.decimals();

      const res = await erc20Contract.approve(
        import.meta.env.VITE_BURST_LOCKER,
        BigInt(userBalance) * 10n ** BigInt(res2)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const checkApprove = async () => {
    try {
      const res = await erc20Contract.allowance(
        wallet.accounts[0].address,
        import.meta.env.VITE_BURST_LOCKER
      );
      setAllowance(Number(BigInt(res._hex) / 10n ** 18n));
      console.log("lock allowance,", Number(BigInt(res._hex) / 10n ** 18n));
      if (res == 0) {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBalance = async () => {
    try {
      const res = await erc20Contract.balanceOf(wallet.accounts[0].address);
      const res2 = await erc20Contract.decimals();
      console.log(Number(BigInt(res._hex) / 10n ** BigInt(res2)));
      setUserBalance(Number(BigInt(res._hex) / 10n ** BigInt(res2)));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    async function Connect() {
      if (wallet) {
        // if using ethers v6 this is:
        // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
        const provider = new ethers.providers.Web3Provider(wallet.provider);
        const signer = await provider.getSigner();
        const Contract = new ethers.Contract(
          "0x0535a470f39DEc973C15D2Aa6E7f968235F6e1D4",
          erc20TokenAbi,
          provider
        );
        const LockContract = new ethers.Contract(
          import.meta.env.VITE_BURST_LOCKER,
          LockerAbi,
          provider
        );

        setLockContract(LockContract.connect(signer));
        const connectedContract = Contract.connect(signer);
        setErc20Contract(connectedContract);
      }
    }
    Connect();
  }, [wallet]);

  const lock = async () => {
    try {
      const res = await lockContract.lock(
        wallet.accounts[0].address,
        BigInt(lockValue) * 10n ** 18n,
        0
      );
    } catch (error) {
      console.log(error);
    }
  };
  const approved = wallet && allowance > 0 && lockValue < allowance;
  const { lockCount = 0, lockEarnedValue = 0 } = contextValue;
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
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <img
                  src={burstIcon}
                  style={{ height: "48px", width: "48px", marginTop: "4px" }}
                ></img>
                Burst
              </Box>
            }
          ></HeadInfo>

          <HeadInfo
            head={"All Claimable"}
            content={`$${lockEarnedValue?.toFixed(2) || 0}`}
          />
          <HeadInfo
            head={"My Apr"}
            content={`${
              lockEarnedValue
                ? (
                    (lockEarnedValue / contextValue?.lockValue / 7) *
                    365 *
                    100
                  ).toFixed(2)
                : 0
            }%`}
          />
          <HeadInfo
            head={"Max Apr"}
            content={`${lockInfo?.max_apr?.toFixed(2) || 0}%`}
          />
          <HeadInfo
            head={"My Burst locked"}
            content={`${lockCount || 0} Burst = $${
              contextValue?.lockValue?.toFixed(2) || 0
            }`}
          />
          <HeadInfo
            head={"TVL"}
            content={`$${lockInfo?.tvl?.toFixed(2) || 0}`}
            noBorder
          />
        </Stack>
      </Box>
      <Box textAlign={"left"}>
        Lock $BURST for a duration of 16 weeks. Lock $BURST grants voting power
        for determining Blur governance votes, as well as influencing Admin
        Proposals on Burst. Additionally, holding locked BURST entitles you to a
        portion of the platform's fees.
        <a
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open("https://gov.blur.foundation/");
          }}
        >
          https://gov.blur.foundation/
        </a>
      </Box>
      <Stack
        direction={"row"}
        alignItems={"flex-end"}
        alignContent={"baseline"}
      >
        <Box width={400} position={"relative"} marginTop={5}>
          <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
            Avaliable : {userBalance} Burst
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
                setLockValue(userBalance);
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
              src={burstIcon}
              style={{ width: "32px", borderRadius: "50%" }}
            />
          </Box>
          <StyledInput
            value={lockValue === 0 ? "" : lockValue}
            onChange={(e) => {
              setLockValue(e.target.value);
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
                color: approved ? "#929292" : "#000",
                background: !wallet ? "rgba(146, 146, 146, 0.2)" : "yellow",
              }}
            >
              1
            </Box>
          </Stack>
          {approved && (
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
          {!approved && (
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
              background: !approved ? "rgba(146, 146, 146, 0.2)" : "yellow",
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
                color: approved ? "#929292" : "#000",
                background: !approved ? "rgba(146, 146, 146, 0.2)" : "yellow",
              }}
            >
              2
            </Box>
          </Stack>
          <FunctionButton
            burstColor={wallet && approved ? "yellow" : "black"}
            sx={{ marginX: "8px", height: "41px", color: "#000" }}
            variant="contained"
            //   disabled
            onClick={() => {
              lock();
            }}
          >
            Lock
          </FunctionButton>
        </Box>
      </Stack>
    </Layout>
  );
};
export default Lock;
