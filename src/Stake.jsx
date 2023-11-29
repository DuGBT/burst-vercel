import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Layout from "./App";
import { erc20TokenAbi } from "./abi/erc20token";
import { blurDepositAbi } from "./abi/blur-depositer";
import { WblurStakeAbi } from "./abi/wblur-staking";
import { useConnectWallet } from "@web3-onboard/react";
import * as ethers from "ethers";
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

function HeadInfoItem({ head, content }) {
  return (
    <Box>
      <Stack>
        <Box
          sx={{ opacity: 0.5 }}
          fontSize={13}
          fontWeight={500}
          color={"#fff"}
        >
          {head}
        </Box>
        <Box fontSize={17} fontWeight={700} color={"#fff"}>
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

console.log(ethers);

const Stake = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [convertAndStakeValue, setConvertAndStakevalueValue] = useState(0);
  const [convertValue, setConvertValue] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);
  const [ethersProvider, setProvider] = useState();
  const [erc20Contract, setErc20Contract] = useState();
  const [wBlurErc20Contract, setWBlurErc20Contract] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [userWblurBalance, setUserWblurBalance] = useState(0);
  console.log(userBalance);
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
        const connectedContract = Contract.connect(signer);
        const connectedWBlurContract = WblurContract.connect(signer);
        setErc20Contract(connectedContract);
        setWBlurErc20Contract(connectedWBlurContract);
        console.log(connectedWBlurContract, connectedContract, 456456);
        setProvider(provider);
      }
    }
    Connect();
  }, [wallet]);

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
  const getWblurBalance = async () => {
    console.log(wBlurErc20Contract);
    try {
      const res = await wBlurErc20Contract.balanceOf(
        wallet.accounts[0].address
      );
      const res2 = await wBlurErc20Contract.decimals();
      console.log("balance", res, res2);
      console.log(Number(BigInt(res._hex) / 10n ** BigInt(res2)));
      setUserWblurBalance(Number(BigInt(res._hex) / 10n ** BigInt(res2)));
    } catch (error) {
      console.log(error);
    }
  };
  function convertScientificToZeroes(number) {
    const result = Number.parseFloat(number).toFixed().slice(1);
    return result;
  }
  const approve = async () => {
    try {
      const res2 = await erc20Contract.decimals();

      const res = await erc20Contract.approve(
        "0x4e74c4c76625d1A3f2f2285651A15580023762E6",
        BigInt(userBalance * 10 ** res2)
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
        BigInt(userWblurBalance * 10 ** res2)
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const checkApprove = async () => {
    try {
      await getBalance();
      const res = await erc20Contract.allowance(
        wallet.accounts[0].address,
        "0x4e74c4c76625d1A3f2f2285651A15580023762E6"
      );
      console.log("allowance", res);
      if (res == 0) {
        // approve();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (erc20Contract) {
      checkApprove();
      getBalance();
    }
  }, [erc20Contract]);
  useEffect(() => {
    if (wBlurErc20Contract) {
      getWblurBalance();
    }
  }, [wBlurErc20Contract]);
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
      <Box sx={{ fontWeight: "500" }}>
        CONVERT CRV to cvxCRV. By staking cvxCRV, you’re earning the usual
        rewards from veCRV (3crv governance fee distribution from Curve + any
        airdrop), plus a share of 10% of the Convex LPs’ boosted CRV earnings,
        and CVX tokens on top of that. Important: Converting CRV to cvxCRV is
        irreversible. You may stake and unstake cvxCRV tokens, but not convert
        them back to CRV. Secondary markets however exist to allow the exchange
        of cvxCRV for CRV at varying market rates.
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
          <StyledInput
            value={convertAndStakeValue}
            onChange={(e) => {
              setConvertAndStakevalueValue(e.target.value);
            }}
            sx={{ width: "100%" }}
          />
        </Box>
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
          <StyledInput
            value={convertValue}
            onChange={(e) => {
              setConvertValue(e.target.value);
            }}
            sx={{ width: "100%" }}
          />
        </Box>
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
          <StyledInput
            value={stakeValue}
            onChange={(e) => {
              setStakeValue(e.target.value);
            }}
            sx={{ width: "100%" }}
          />
        </Box>
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
                BigInt(stakeValue) * 10n ** 18n
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
    </Layout>
  );
};
export default Stake;
