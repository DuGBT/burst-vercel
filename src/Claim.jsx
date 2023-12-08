import Layout from "./App";
import { useState, useEffect, useContext } from "react";
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
import { getLockInfo, getClaimPoolInfo } from "./api";

import { WblurStakeAbi } from "./abi/wblur-staking";
import { LockerAbi } from "./abi/burst-locker";
import { MyContext } from "./Context";
import * as ethers from "ethers";
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
function HeadInfo({ head, content, sx }) {
  return (
    <Box sx={sx}>
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
const Claim = () => {
  const { contextValue, updateContextValue } = useContext(MyContext);

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [lockInfo, setLockInfo] = useState();

  const [ethersProvider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [lockContract, setLockContract] = useState();
  const [stakeLPContract, setStakeLPContract] = useState();
  const [poolInfo, setPoolInfo] = useState();
  useEffect(() => {
    async function Connect() {
      if (wallet) {
        // if using ethers v6 this is:
        // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
        const provider = new ethers.providers.Web3Provider(wallet.provider);
        const signer = await provider.getSigner();
        const stakeContract = new ethers.Contract(
          import.meta.env.VITE_WBLUR_STAKING,
          WblurStakeAbi,
          ethersProvider
        );
        const LockContract = new ethers.Contract(
          import.meta.env.VITE_BURST_LOCKER,
          LockerAbi,
          provider
        );
        const stakeLPContract = new ethers.Contract(
          "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f",
          WblurStakeAbi,
          provider
        );
        setStakeLPContract(stakeLPContract.connect(signer));

        setContract(stakeContract.connect(signer));
        setLockContract(LockContract.connect(signer));
      }
    }
    Connect();
  }, [wallet]);

  async function getLockBurstInfo() {
    try {
      const res = await getLockInfo();
      setLockInfo(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function getPoolInfo() {
    try {
      const res = await getClaimPoolInfo();
      setPoolInfo(res);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getLockBurstInfo();
  }, []);
  useEffect(() => {
    getPoolInfo();
  }, []);

  const {
    lockEarnedValue = 0,
    lockValue = 0,
    stakedLPValue = 0,
    earnedLPCount = 0,
    earnedLPValue = 0,
    stakedWblurValue = 0,
    earnedWblurCount = 0,
    earnedWblurValue = 0,
    stakedWblurExtraRewardInfo,
    stakedLPExtraRewardInfo,
    stakedLPExtraTotalValue = 0,
    stakedWblurExtraTotalValue = 0,
    lockClaimableTokens,
    tokenPrice,
  } = contextValue;

  return (
    <Layout>
      <StyledAccordion
        sx={{
          background: "rgb(42, 42, 42)",
          color: "#fff",
          marginBottom: "20px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack width={"100%"} direction={"row"} textAlign={"left"}>
            <Box sx={{ fontSize: "17px", fontWeight: 700, flex: "1 1 0px" }}>
              Stake Wblur
            </Box>
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Claimable (USD value)"}
              content={`$${
                (earnedWblurValue + stakedWblurExtraTotalValue).toFixed(2) || 0
              }`}
            />

            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Apr"}
              content={`${
                stakedWblurValue
                  ? (
                      ((earnedWblurValue + stakedWblurExtraTotalValue) /
                        stakedWblurValue /
                        7) *
                      365 *
                      100
                    ).toFixed(2)
                  : 0
              }%`}
            />
            <FunctionButton
              burstColor={earnedWblurValue ? "yellow" : "black"}
              sx={{
                maxWidth: "120px",
                flex: "1 1 0px",
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
            </FunctionButton>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {poolInfo && stakedWblurExtraRewardInfo && (
            <Box>
              <Stack direction={"row"}>
                <Box sx={{ width: "100px", textAlign: "left" }}>{"Burst"}</Box>

                <Box sx={{ textAlign: "left" }}>
                  {`${earnedWblurCount || 0} ≈ $ ${
                    earnedWblurValue?.toFixed(2) || 0
                  }`}
                </Box>
              </Stack>
              {poolInfo
                .find((pool) => {
                  if (
                    pool.addr.toLowerCase() ===
                    import.meta.env.VITE_WBLUR_STAKING.toLowerCase()
                  )
                    return pool;
                })
                .reward_list.map((reward) => {
                  if (
                    reward.addr.toLowerCase() ===
                    "0x0535a470f39DEc973C15D2Aa6E7f968235F6e1D4".toLowerCase()
                  ) {
                    return <></>;
                  }
                  const extraRewardInfo = stakedWblurExtraRewardInfo.find(
                    (extraReward) => {
                      if (
                        extraReward?.tokenAddress?.toLowerCase() ===
                        reward.addr.toLowerCase()
                      )
                        return true;
                    }
                  );
                  const extraRewardValue =
                    extraRewardInfo?.amount *
                    tokenPrice[reward.addr.toLowerCase()];
                  return (
                    <Stack direction={"row"}>
                      <Box sx={{ width: "100px", textAlign: "left" }}>
                        {reward.symbol}
                      </Box>
                      <Box sx={{ textAlign: "left" }}>
                        {`${extraRewardInfo?.amount || 0} ≈ $ ${
                          extraRewardValue?.toFixed(2) || 0
                        }`}
                      </Box>
                    </Stack>
                  );
                })}
            </Box>
          )}
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion
        sx={{
          background: "rgb(42, 42, 42)",
          color: "#fff",
          marginBottom: "20px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack width={"100%"} direction={"row"} textAlign={"left"}>
            <Box sx={{ fontSize: "17px", fontWeight: 700, flex: "1 1 0px" }}>
              Lock Burst
            </Box>
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Claimable (USD value)"}
              content={`$${lockEarnedValue?.toFixed(2) || 0}`}
            />
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Apr"}
              content={`${
                lockEarnedValue
                  ? ((lockEarnedValue / lockValue / 7) * 365 * 100).toFixed(2)
                  : 0
              }%`}
            />
            <FunctionButton
              burstColor={lockEarnedValue ? "yellow" : "black"}
              sx={{
                flex: "1 1 0px",
                maxWidth: "120px",
                marginX: "8px",
                height: "41px",
                color: "#000",
              }}
              onClick={async () => {
                try {
                  const res = await lockContract.getReward(
                    wallet.accounts[0].address
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
              variant="contained"
            >
              Claim
            </FunctionButton>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {poolInfo && lockClaimableTokens && (
            <Box>
              {poolInfo
                .find((pool) => {
                  if (
                    pool.addr.toLowerCase() ===
                    import.meta.env.VITE_BURST_LOCKER.toLowerCase()
                  )
                    return pool;
                })
                .reward_list.map((reward) => {
                  const rewardInfo = lockClaimableTokens.find((token) => {
                    if (
                      token.address.toLowerCase() === reward.addr.toLowerCase()
                    )
                      return true;
                  });
                  return (
                    // <Stack direction={"row"}>
                    //   <Box sx={{ marginRight: "10px" }}>{reward.symbol}</Box>
                    //   <Box>{rewardInfo?.count || 0}</Box>
                    //   <Box>{rewardInfo?.value?.toFixed(2) || 0}</Box>
                    // </Stack>
                    <Stack direction={"row"}>
                      <Box sx={{ width: "100px", textAlign: "left" }}>
                        {reward.symbol}
                      </Box>

                      <Box sx={{ textAlign: "left" }}>
                        {`${rewardInfo?.count || 0} ≈ $ ${
                          rewardInfo?.value?.toFixed(2) || 0
                        }`}
                      </Box>
                    </Stack>
                  );
                })}
            </Box>
          )}
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion sx={{ background: "rgb(42, 42, 42)", color: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack width={"100%"} direction={"row"} textAlign={"left"}>
            <Box sx={{ fontSize: "17px", fontWeight: 700, flex: "1 1 0px" }}>
              Stake LP
            </Box>
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Claimable (USD value)"}
              content={`$${
                (earnedLPValue + stakedLPExtraTotalValue)?.toFixed(2) || 0
              }`}
            />
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Apr"}
              content={`${
                earnedLPValue
                  ? (
                      ((earnedLPValue + stakedLPExtraTotalValue) /
                        stakedLPValue /
                        7) *
                      365 *
                      100
                    ).toFixed(2)
                  : 0
              }%`}
            />
            <FunctionButton
              burstColor={earnedLPValue ? "yellow" : "black"}
              sx={{
                flex: "1 1 0px",
                maxWidth: "120px",
                marginX: "8px",
                height: "41px",
                color: "#000",
              }}
              onClick={async () => {
                try {
                  const res = await stakeLPContract.getReward();
                } catch (error) {
                  console.log(error);
                }
              }}
              variant="contained"
            >
              Claim
            </FunctionButton>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {poolInfo && stakedLPExtraRewardInfo && (
            <Box>
              <Stack direction={"row"}>
                <Box sx={{ width: "100px", textAlign: "left" }}>{"Burst"}</Box>

                <Box sx={{ textAlign: "left" }}>
                  {`${earnedLPCount || 0} ≈ $ ${
                    earnedLPValue?.toFixed(2) || 0
                  }`}
                </Box>
              </Stack>
              {poolInfo
                .find((pool) => {
                  if (
                    pool.addr.toLowerCase() ===
                    "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f".toLowerCase()
                  )
                    return pool;
                })
                .reward_list.map((reward) => {
                  if (
                    reward.addr.toLowerCase() ===
                    "0x0535a470f39DEc973C15D2Aa6E7f968235F6e1D4".toLowerCase()
                  ) {
                    return <></>;
                  }
                  const extraRewardInfo = stakedLPExtraRewardInfo.find(
                    (extraReward) => {
                      if (
                        extraReward?.tokenAddress?.toLowerCase() ===
                        reward.addr.toLowerCase()
                      )
                        return true;
                    }
                  );
                  return (
                    <Stack direction={"row"}>
                      <Box sx={{ marginRight: "10px" }}>{reward.symbol}</Box>
                      <Box>{extraRewardInfo?.amount || 0}</Box>
                    </Stack>
                  );
                })}
            </Box>
          )}
        </AccordionDetails>
      </StyledAccordion>
    </Layout>
  );
};

export default Claim;
