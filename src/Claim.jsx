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
import { tokenLockerAbi } from "./abi/token-locker";
import BHPIcon from "./assets/BHP_Yellow.png";
import { MyContext } from "./Context";
import * as ethers from "ethers";
import burstIcon from "./assets/BURST_Icon_Black.png";
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

function calculateWeeksRemaining(timestamp) {
  const now = Date.now();

  const timeDifference = timestamp - now;

  if (timeDifference <= 0) {
    return 0;
  }

  const weeksRemaining = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));

  return weeksRemaining;
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
  "&.MuiButton-root.Mui-disabled": {
    color: "rgba(255,255,255,0.6)",
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
  const [burstLockerContract, setBurstLockerContract] = useState();
  const [poolInfo, setPoolInfo] = useState([]);
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
        const tokenLockerContract = new ethers.Contract(
          import.meta.env.VITE_TOKEN_LOCKER,
          tokenLockerAbi,
          provider
        );

        setStakeLPContract(stakeLPContract.connect(signer));
        setBurstLockerContract(tokenLockerContract.connect(signer));

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
    tokenLockerBalance = 0,
    tokenLockerValue = 0,
    releasableBalance = 0,
    releasableValue = 0,
    getTotalClaimable,
    burstBalanceInLockerRes,
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
              burstColor={
                earnedWblurValue + stakedWblurExtraTotalValue > 0
                  ? "yellow"
                  : "black"
              }
              sx={{
                maxWidth: "120px",
                flex: "1 1 0px",
                marginX: "8px",
                height: "41px",
                color: "#000",
              }}
              onClick={async () => {
                try {
                  const transaction = await contract.getReward();

                  const receipt = await transaction.wait();
                  if (receipt.status === 1) {
                    getTotalClaimable();
                  } else {
                    console.error(
                      "Transaction failed. Error message:",
                      receipt.statusText
                    );
                  }
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
          {poolInfo.length > 0 && (
            <Box>
              <Stack direction={"row"}>
                <Box sx={{ width: "40px", textAlign: "left" }}>
                  <img src={burstIcon} style={{ height: "24px" }}></img>
                </Box>
                <Box sx={{ width: "60px", textAlign: "left" }}>{"Burst"}</Box>

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
                  let extraRewardValue;
                  let extraRewardInfo;
                  if (stakedWblurExtraRewardInfo) {
                    extraRewardInfo = stakedWblurExtraRewardInfo.find(
                      (extraReward) => {
                        if (
                          extraReward?.tokenAddress?.toLowerCase() ===
                          reward.addr.toLowerCase()
                        )
                          return true;
                      }
                    );
                    extraRewardValue =
                      (extraRewardInfo?.amount || 0) *
                      tokenPrice[reward.addr.toLowerCase()];
                  } else extraRewardValue = 0;
                  return (
                    <Stack direction={"row"}>
                      <Box sx={{ width: "40px", textAlign: "left" }}>
                        <img
                          src={
                            reward.symbol === "Burst"
                              ? burstIcon
                              : reward.symbol === "BHP"
                              ? BHPIcon
                              : reward.icon
                          }
                          style={{ height: "24px" }}
                        ></img>
                      </Box>

                      <Box sx={{ width: "60px", textAlign: "left" }}>
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
                lockValue
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
                  const transaction = await lockContract.getReward(
                    wallet.accounts[0].address
                  );

                  const receipt = await transaction.wait();
                  if (receipt.status === 1) {
                    getTotalClaimable();
                  } else {
                    console.error(
                      "Transaction failed. Error message:",
                      receipt.statusText
                    );
                  }
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
          {poolInfo.length > 0 && (
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
                  let rewardInfo;
                  if (lockClaimableTokens) {
                    rewardInfo = lockClaimableTokens.find((token) => {
                      if (
                        token.address.toLowerCase() ===
                        reward.addr.toLowerCase()
                      )
                        return true;
                    });
                  }
                  return (
                    <Stack direction={"row"}>
                      <Box sx={{ width: "40px", textAlign: "left" }}>
                        <img
                          src={
                            reward.symbol === "Burst"
                              ? burstIcon
                              : reward.symbol === "BHP"
                              ? BHPIcon
                              : reward.icon
                          }
                          style={{ height: "24px" }}
                        ></img>
                      </Box>

                      <Box sx={{ width: "60px", textAlign: "left" }}>
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
              burstColor={
                earnedLPValue + stakedLPExtraTotalValue > 0 ? "yellow" : "black"
              }
              sx={{
                flex: "1 1 0px",
                maxWidth: "120px",
                marginX: "8px",
                height: "41px",
                color: "#000",
              }}
              onClick={async () => {
                try {
                  const transaction = await stakeLPContract.getReward(
                    wallet.accounts[0].address
                  );

                  const receipt = await transaction.wait();
                  if (receipt.status === 1) {
                    getTotalClaimable();
                  } else {
                    console.error(
                      "Transaction failed. Error message:",
                      receipt.statusText
                    );
                  }
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
          {poolInfo.length > 0 && (
            <Box>
              <Stack direction={"row"}>
                <Box sx={{ width: "40px", textAlign: "left" }}>
                  <img src={burstIcon} style={{ height: "24px" }}></img>
                </Box>
                <Box sx={{ width: "60px", textAlign: "left" }}>{"Burst"}</Box>

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
                  let extraRewardInfo;
                  if (stakedLPExtraRewardInfo) {
                    extraRewardInfo = stakedLPExtraRewardInfo.find(
                      (extraReward) => {
                        if (
                          extraReward?.tokenAddress?.toLowerCase() ===
                          reward.addr.toLowerCase()
                        )
                          return true;
                      }
                    );
                  }
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
      <StyledAccordion sx={{ background: "rgb(42, 42, 42)", color: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack width={"100%"} direction={"row"} textAlign={"left"}>
            <Box sx={{ fontSize: "17px", fontWeight: 700, flex: "1 1 0px" }}>
              Rewards
              <Stack direction={"row"}>
                <Box sx={{ width: "40px", textAlign: "left" }}>
                  <img src={burstIcon} style={{ height: "24px" }}></img>
                </Box>
                <Box sx={{ width: "60px", textAlign: "left" }}>{"Burst"}</Box>
              </Stack>
            </Box>
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Claimable (USD value)"}
              content={`$${releasableValue?.toFixed(2) || 0}`}
            />
            <HeadInfo
              sx={{ flex: "1 1 0px" }}
              head={"Unlocking reward"}
              content={`$${tokenLockerValue?.toFixed(2) || 0}`}
            />
            <FunctionButton
              burstColor={releasableValue ? "yellow" : "black"}
              sx={{
                flex: "1 1 0px",
                maxWidth: "120px",
                marginX: "8px",
                height: "41px",
                color: "#000",
              }}
              onClick={async () => {
                try {
                  const transaction = await burstLockerContract.releaseToken();

                  const receipt = await transaction.wait();
                  if (receipt.status === 1) {
                    getTotalClaimable();
                  } else {
                    console.error(
                      "Transaction failed. Error message:",
                      receipt.statusText
                    );
                  }
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
          <Stack
            direction={"row"}
            // sx={{ justifyContent: tokenLockerValue > 0 ? "space-around" : "" }}
            textAlign={"left"}
          >
            {tokenLockerValue > 0 && (
              <Box sx={{ width: "40%" }}>
                <Box textAlign={"left"} sx={{ marginBottom: "20px" }}>
                  Unlocking Progress
                </Box>
                {burstBalanceInLockerRes &&
                  burstBalanceInLockerRes.lockData.length > 0 && (
                    <Stack direction={"row"} sx={{ fontFamily: "Rajdhani" }}>
                      <Box sx={{ flex: "1 1 0px" }}>Amount</Box>
                      <Box sx={{ flex: "1 1 50px" }}> UnlockTime</Box>
                      <Box sx={{ flex: "1 1 0px" }}> Remaining</Box>
                    </Stack>
                  )}
                {burstBalanceInLockerRes &&
                  burstBalanceInLockerRes.lockData.length > 0 &&
                  burstBalanceInLockerRes.lockData.map((data) => {
                    return (
                      <Stack direction={"row"} sx={{ marginBottom: "20px" }}>
                        <Box sx={{ flex: "1 1 0px" }}>
                          {Number(BigInt(data.amount) / 10n ** 16n) / 100}
                        </Box>
                        <Box sx={{ flex: "1 1 50px" }}>
                          {new Date(data.endTime * 1000).toLocaleString()}
                        </Box>
                        <Box sx={{ flex: "1 1 0px" }}>
                          {` ${calculateWeeksRemaining(
                            data.endTime * 1000
                          )} Weeks`}
                        </Box>
                      </Stack>
                    );
                  })}
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </StyledAccordion>
    </Layout>
  );
};

export default Claim;
