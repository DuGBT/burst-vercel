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
    border: "1px solid #C3D4A54D",
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
const Lock = () => {
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
        Lock CVX for 16 weeks + 4 days. Locked CVX gives voting weight for Curve
        Gauge Weight Votes, and for Admin Proposals on Curve, Frax, Frax Price
        Index, Prisma, f(x) Protocol, and of course Convex. Locked CVX also
        earns a share of platform fees.
      </Box>
      <Stack
        direction={"row"}
        alignItems={"flex-end"}
        alignContent={"baseline"}
      >
        <Box width={400} position={"relative"} marginTop={5}>
          <Box position={"absolute"} top={-30} right={0} color={"yellow"}>
            Avaliable : 0 CRV
          </Box>
          <StyledInput
            sx={{ width: "100%" }}
            label="Amount of CRV to lock"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Button
          sx={{
            marginX: "8px",
            height: "41px",
            background: "yellow",
            color: "#000",
          }}
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
          lock CVX
        </Button>
      </Stack>
    </Layout>
  );
};
export default Lock;
