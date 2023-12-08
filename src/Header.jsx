import { useEffect, useState } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { useConnectWallet } from "@web3-onboard/react";
import { Link, useParams } from "react-router-dom";
import BurstLogo from "./assets/BURST_Logo_Yellow.png";
function Header({ children }) {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

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
  });

  const YellowButton = styled(Button)({
    "&.MuiButton-root": { background: "yellow !important" },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const name = window.location.pathname;

    if (name === "/stake") {
      setValue(0);
    }
    if (name === "/claim") {
      setValue(1);
    }
    if (name === "/lock") {
      setValue(2);
    }
  }, []);

  return (
    <Box sx={{ position: "fixed", width: "100%", zIndex: "1000", top: 0 }}>
      <Box className="header">
        <Box
          sx={{
            background: "transparent",
            height: 200,
            p: 0,
            position: "relative",
            zIndex: "1000",
          }}
        >
          <Box sx={{ position: "absolute", top: "0", cursor: "pointer" }}>
            <Link to={"/"}>
              <img src={BurstLogo} style={{ width: "300px" }} />
            </Link>
          </Box>
          <YellowButton
            sx={{
              background: "yellow",
              fontFamily: "Rajdhani Bold",
              color: "#000",
              position: "absolute",
              right: "0",
              top: "0",
            }}
            onClick={() => {
              wallet ? disconnect(wallet) : connect();
            }}
          >
            {wallet
              ? `${wallet.accounts[0].address.slice(
                  0,
                  6
                )}...${wallet.accounts[0].address.slice(-4)}`
              : "Connect Wallet"}
          </YellowButton>
          <Stack width={"100%"} direction={"row"} justifyContent={"center"}>
            <StyledTabs value={value} onChange={handleChange} centered>
              <Link to={"/stake"}>
                <StyledTab
                  label="Stake"
                  disableTouchRipple
                  sx={{
                    border: "none",
                    fontWeight: "700",
                    fontSize: "16px",
                    textTransform: "none",
                    color:
                      window.location.pathname === "/stake" ||
                      window.location.pathname === ""
                        ? "yellow"
                        : "#929292",
                  }}
                />
              </Link>
              <Link to={"/claim"}>
                <StyledTab
                  label="Claim"
                  disableTouchRipple
                  sx={{
                    border: "none",
                    color:
                      window.location.pathname === "/claim"
                        ? "yellow"
                        : "#929292",

                    fontWeight: "700",
                    fontSize: "16px",
                    textTransform: "none",
                  }}
                />
              </Link>
              <Link to={"/lock"}>
                <StyledTab
                  label="Lock"
                  disableTouchRipple
                  sx={{
                    border: "none",
                    color:
                      window.location.pathname === "/lock"
                        ? "yellow"
                        : "#929292",
                    fontWeight: "700",
                    fontSize: "16px",
                    textTransform: "none",
                  }}
                />
              </Link>
            </StyledTabs>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
