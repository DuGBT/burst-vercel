import Layout from "./App";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material";
import { useConnectWallet } from "@web3-onboard/react";

import { WblurStakeAbi } from "./abi/wblur-staking";
import * as ethers from "ethers";
import { Contrast } from "@mui/icons-material";
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

const WhiteDisabledButton = styled(Button)({
  "&.Mui-disabled": {
    background: "#d7d7d7",
    color: "rgba(0, 0, 0, 0.26)",
    borderRadius: "10px",
  },
});

const StyledAccordion = styled(Accordion)({
  ".MuiAccordionSummary-root:hover:not(.Mui-expanded)": {
    backgroundColor: "rgb(6,6,6)",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#fff",
  },
});
const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});

const Claim = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [ethersProvider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [earnValue, setEarnValue] = useState(0);
  useEffect(() => {
    async function Connect() {
      if (wallet) {
        // if using ethers v6 this is:
        // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
        const provider = new ethers.providers.Web3Provider(wallet.provider);
        const signer = await provider.getSigner();
        const stakeContract = new ethers.Contract(
          "0x56f9E3de66600ca09F2568c11a5F2D1E793C0ef2",
          WblurStakeAbi,
          ethersProvider
        );
        setContract(stakeContract.connect(signer));
      }
    }
    Connect();
  }, [wallet]);

  const getEarned = async () => {
    try {
      const res = await contract.earned(wallet.accounts[0].address);
      console.log(Number(BigInt(res._hex) / 10n ** 18n));
      setEarnValue(Number(BigInt(res._hex) / 10n ** 18n));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (contract) getEarned();
  }, [contract]);

  return (
    <Layout>
      <StyledAccordion sx={{ background: "rgb(42, 42, 42)", color: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack
            width={"100%"}
            direction={"row"}
            textAlign={"left"}
            justifyContent={"space-between"}
          >
            <Box sx={{ fontSize: "17px", fontWeight: 700 }}>Stake Wblur</Box>
            <HeadInfo head={"Claimable (USD value)"} content={earnValue} />
            <HeadInfo head={"vApr"} content={"0.43%"} />
            <YellowButton
              sx={{
                marginX: "8px",
                height: "41px",
                color: "#000",
              }}
              onClick={async () => {
                try {
                  const res = await contract.getReward();
                  console.log(res);
                } catch (error) {
                  console.log(error);
                }
              }}
              variant="contained"
            >
              Claim
            </YellowButton>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion sx={{ background: "rgb(42, 42, 42)", color: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack
            width={"100%"}
            direction={"row"}
            textAlign={"left"}
            justifyContent={"space-between"}
          >
            <Box sx={{ fontSize: "17px", fontWeight: 700 }}>Lock Burst</Box>
            <HeadInfo head={"Claimable (USD value)"} content={"$0"} />
            <HeadInfo head={"vApr"} content={"0.43%"} />
            <WhiteDisabledButton
              disabled
              sx={{
                marginX: "8px",
                height: "41px",
                background: "#eee",
              }}
              variant="contained"
            >
              Claim
            </WhiteDisabledButton>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </StyledAccordion>
    </Layout>
  );
};

export default Claim;
