import Stack from "@mui/material/Stack";
import XIcon from "./assets/x.svg";
import gitbookIcon from "./assets/gitbook.svg";
const Footer = () => (
  <Stack
    position={"absolute"}
    sx={{
      zIndex: "100",
      width: "100%",
      bottom: "2rem",
      justifyContent: "center",
      marginTop: "100px",
      // marginBottom: "2rem",
    }}
    direction={"row"}
  >
    <img
      src={XIcon}
      style={{ width: "24px", marginRight: "20px", cursor: "pointer" }}
    />
    <img src={gitbookIcon} style={{ width: "24px", cursor: "pointer" }} />
  </Stack>
);

export default Footer;
