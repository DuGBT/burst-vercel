import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Layout from "./App";
import { useState, useEffect } from "react";
import { erc20TokenAbi } from "./abi/erc20token";
import { LockerAbi } from "./abi/burst-locker";
import { useConnectWallet } from "@web3-onboard/react";
import * as ethers from "ethers";
const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});
const BlackButton = styled(Button)({
  "&.MuiButton-root": { background: "#000" },
});
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
function HeadInfo({ head, content }) {
  return (
    <Box>
      <HeadInfoItem head={head} content={content}></HeadInfoItem>
    </Box>
  );
}
const Lock = () => {
  const [lockValue, setLockValue] = useState(0);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [erc20Contract, setErc20Contract] = useState();
  const [allowance, setAllowance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [lockContract, setLockContract] = useState();
  useEffect(() => {
    if (erc20Contract) {
      getBalance();
      checkApprove();
    }
  }, [erc20Contract]);

  const approve = async () => {
    try {
      const res2 = await erc20Contract.decimals();

      const res = await erc20Contract.approve(
        "0x8aEE0D7dd5024bF6430d30D4eAD90f8903e724A9",
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
        "0x8aEE0D7dd5024bF6430d30D4eAD90f8903e724A9"
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
          "0x8aEE0D7dd5024bF6430d30D4eAD90f8903e724A9",
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
      <Box textAlign={"left"}>
        Lock $BURST for a duration of 16 weeks. Lock $BURST grants voting power
        for determining Blur governance votes, as well as influencing Admin
        Proposals on Burst. Additionally, holding locked BURST entitles you to a
        portion of the platform's fees.{" "}
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
          <StyledInput
            value={lockValue === 0 ? "" : lockValue}
            onChange={(e) => {
              setLockValue(e.target.value);
              console.log(typeof e.target.value);
            }}
            sx={{ width: "100%" }}
          />
        </Box>
        {allowance > 0 && lockValue < allowance && (
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
        {(allowance === 0 || lockValue > allowance) && (
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
          onClick={() => {
            lock();
          }}
        >
          lock Burst
        </YellowButton>
      </Stack>
    </Layout>
  );
};
export default Lock;
