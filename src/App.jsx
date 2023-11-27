import { useEffect, useState } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material";
// import Stake from "./Stake";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Layout({ children }) {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);

  const StyledTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      transition: "none",
    },
  });

  const StyledTab = styled(Tab)({
    "&:focus": {
      outline: "none",
    },
    "&.MuiButtonBase-root.Mui-selected": {
      color: "#fff",
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const name = window.location.pathname;
    console.log(name);
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
    <div>
      <div className="header">
        <Box sx={{ background: "#000", height: 200, p: 0 }}>
          <StyledTabs
            sx={{ color: "#fff" }}
            value={value}
            onChange={handleChange}
            centered
          >
            <StyledTab
              onClick={() => {
                if (window.location.pathname !== "/stake")
                  window.location.href = "/stake";
              }}
              label="Stake"
              disableTouchRipple
              sx={{
                border: "none",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                textTransform: "none",
              }}
            />
            <StyledTab
              onClick={() => {
                if (window.location.pathname !== "/claim")
                  window.location.href = "/claim";
              }}
              label="Claim"
              disableTouchRipple
              sx={{
                border: "none",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                textTransform: "none",
              }}
            />
            <StyledTab
              onClick={() => {
                if (window.location.pathname !== "/lock")
                  window.location.href = "/lock";
              }}
              label="Lock"
              disableTouchRipple
              sx={{
                border: "none",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                textTransform: "none",
              }}
            />
          </StyledTabs>
          <Stack direction={"row"} justifyContent={"center"}>
            <Box
              minHeight={50}
              sx={{
                backgroundColor: "rgba(45, 45, 45, 0.8)",
                color: "#fff",
                width: 300,
                height: 100,
                borderRadius: 4,
                m: "10px",
                paddingTop: "20px",
              }}
            >
              <Box sx={{ fontWeight: 700, fontSize: "16px" }}>
                Total Claimable
              </Box>
              <Box sx={{ fontWeight: 700, fontSize: "24px" }}>$0</Box>
            </Box>
            <Box
              minHeight={50}
              sx={{
                backgroundColor: "rgba(45, 45, 45, 0.8)",
                color: "#fff",
                width: 300,
                height: 100,
                borderRadius: 4,
                m: "10px",
                paddingTop: "20px",
              }}
            >
              <Box sx={{ fontWeight: 700, fontSize: "16px" }}>
                Total Deposit
              </Box>
              <Box sx={{ fontWeight: 700, fontSize: "24px" }}>$0</Box>
            </Box>
          </Stack>
        </Box>
      </div>
      <Box
        position={"relative"}
        // height={800}
      >
        <Box
          position={"absolute"}
          top={-10}
          height={72}
          backgroundColor={"#000"}
          width={"100%"}
        ></Box>
        <Box
          maxWidth={"1200px"}
          margin={"0 auto"}
          position={"relative"}
          zIndex={1}
        >
          <Paper elevation={3} sx={{ height: 600, m: 1 }}>
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              {children}
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default Layout;
