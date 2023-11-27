import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Layout from "./App";
const StyledInput = styled(TextField)({
  "& .MuiInputBase-input": {
    padding: "10px",
    paddingTop: "8px",
  },
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
const Stake = () => {
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
      <Box>
        Convert CRV to cvxCRV. By staking cvxCRV, you’re earning the usual
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
          <Box position={"absolute"} top={-30} right={0}>
            Avaliable : 0 CRV
          </Box>
          <StyledInput
            sx={{ width: "100%" }}
            label="Amount of CRV to convert and stake"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Button
          sx={{ marginX: "8px", height: "41px" }}
          variant="contained"
          disabled
        >
          Approve
        </Button>
        <Button
          sx={{ marginX: "8px", height: "41px" }}
          variant="contained"
          disabled
        >
          Convert & Stake
        </Button>
      </Stack>
    </Layout>
  );
};
export default Stake;
