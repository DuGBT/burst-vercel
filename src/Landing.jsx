import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import BurstVideo from "./assets/BurstBG.mp4";
import Header from "./Header";
import { styled } from "@mui/material";
import LaunchIcon from "./assets/LaunchIcon.svg";
import Isolamento from "./assets/Isolamento.svg";
import Rocket from "./assets/Rocket.svg";
import Pig from "./assets/Pig.svg";
import Dots from "./assets/dots.svg";
import BurstIconBlack from "./assets/BURST_Icon_Black.png";
import { Link, useParams } from "react-router-dom";
import XIcon from "./assets/x.svg";
import gitbookIcon from "./assets/gitbook.svg";
import BurstLogo from "./assets/BURST_Logo_Yellow.png";
import firstImg from "./assets/fitst.svg";
import secondImg from "./assets/second.svg";
import thirdImg from "./assets/third.svg";
import fourthImg from "./assets/fourth.svg";
import sup1 from "./assets/sup1.png";
import sup2 from "./assets/sup2.png";
import question from "./assets/question.png";
import mobileBg from "./assets/mobileBg.png";
import Footer from "./Footer";
import Audio from "./Audio";
import { useConnectWallet, useAccountCenter } from "@web3-onboard/react";

const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});
const ScrollPagination = () => {
  const containerRef = useRef(null);
  window.burstLoaded = false;
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 700px)").matches
  );
  const updateAccountCenter = useAccountCenter();

  useEffect(() => {
    window.addEventListener("resize", () => {
      const x = window.matchMedia("(max-width: 700px)");
      setIsMobile(x.matches);
    });
    updateAccountCenter({ enabled: false });
  }, []);
  return (
    <Box
      id="landing"
      ref={containerRef}
      sx={{
        position: "relative",
      }}
    >
      {!isMobile && <Header></Header>}
      {isMobile && (
        <Box position={"absolute"} sx={{ top: "2rem" }}>
          <img src={BurstLogo} style={{ width: "40%" }}></img>
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          top: isMobile ? 160 : 400,
          zIndex: "2",
          textAlign: "left",
          width: "100%",
          paddingLeft: "10%",
        }}
      >
        <Box
          sx={{
            textAlign: "left",
            width: isMobile ? "100%" : "620px",
            wordBreak: "break-word",
            fontFamily: "Rajdhani SemiBold",
            fontSize: "80px",
            lineHeight: "80px",
            color: "rgba(217, 217, 217, 1)",
          }}
        >
          FARM BLUR POINTS TOGETHER
        </Box>
        <Box
          sx={{
            textAlign: "left",
            marginTop: "6px",
            width: isMobile ? "100%" : "620px",
            wordBreak: "break-word",
            fontFamily: "Rajdhani SemiBold",
            fontSize: "24px",
            color: "rgba(195, 212, 165, 1)",
          }}
        >
          STAKE $BLUR, EARN POINTS AND EXTRA YIELDS ($BURST).
        </Box>
        <Link to="/stake">
          <YellowButton
            sx={{
              marginTop: "26px",
              width: "184px",
              fontFamily: "Rajdhani SemiBold",
              fontSize: "24px",
              color: "#000",
              height: "48px",
            }}
          >
            <img src={LaunchIcon} style={{ width: "24px" }} />
            Launch APP
          </YellowButton>
        </Link>
      </Box>
      <Box
        sx={{
          maxHeight: "100vh",

          height: "100vh",
          backgroundColor: "#000",
          marginBottom: "1rem",
        }}
      >
        {!isMobile && (
          <video autoPlay muted loop style={{ height: "100%", width: "100%" }}>
            <source src={BurstVideo} type="video/mp4" />
          </video>
        )}
        {isMobile && (
          <img src={mobileBg} style={{ height: "100%", width: "100%" }} />
        )}
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#000",
          position: "relative",
          marginBottom: "1rem",
        }}
      >
        <img
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
          src={Isolamento}
        />
        <Box
          sx={{
            paddingTop: isMobile ? "0" : "140px",
            textAlign: "left",
            paddingLeft: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Box
            sx={{
              width: isMobile ? "100%" : "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "50px",
              fontWeight: "500",
              lineHeight: "40px",
              textalign: "left",
            }}
          >
            {`Withdraw `}
            <span
              style={{
                fontFamily: "Rajdhani SemiBold",
                color: "rgba(252, 252, 3, 1)",
              }}
            >
              {` without worrying `}
            </span>
            about losing the points multiplier
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            paddingRight: "10%",
          }}
        >
          <img style={{ height: "180px", width: "auto" }} src={Dots} />
          <Box sx={{ textAlign: "right" }}>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "yellow",
                marginBottom: "6px",
              }}
            ></Box>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "#000",
                border: "1px solid #727272",
                marginBottom: "6px",
              }}
            ></Box>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "#000",
                border: "1px solid #727272",
                marginBottom: "6px",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              // textAlign: "left",
              // width: "620px",
              wordBreak: "break-word",
              fontFamily: "Rajdhani SemiBold",
              fontSize: "120px",
              lineHeight: "120px",
              WebkitTextStroke: "2px rgba(195, 212, 165, 0.3)",
              color: "#000",
            }}
          >
            01
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "17px",
              fontWeight: "500",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Burst won't trigger unstaking, thus preserving your multiplier,
            however, you may lose some points based on the duration of your
            absence.
          </Box>
        </Box>
      </Box>
      <Box
        sx={{ height: "100vh", backgroundColor: "#000", position: "relative" }}
      >
        <img
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
          src={Rocket}
        />
        <Box
          sx={{
            paddingTop: isMobile ? "0" : "140px",
            textAlign: "left",
            paddingLeft: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Box
            sx={{
              width: isMobile ? "100%" : "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "50px",
              fontWeight: "500",
              lineHeight: "40px",
              textalign: "left",
            }}
          >
            <span
              style={{
                fontFamily: "Rajdhani SemiBold",
                color: "rgba(252, 252, 3, 1)",
              }}
            >
              {`Enhanced `}
            </span>
            {`Blur Points  `}
            <span
              style={{
                fontFamily: "Rajdhani SemiBold",
                color: "rgba(252, 252, 3, 1)",
              }}
            >
              {`Earning `}
            </span>
            {`w/BURST`}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            paddingRight: "10%",
          }}
        >
          <img style={{ height: "180px", width: "auto" }} src={Dots} />
          <Box sx={{ textAlign: "right" }}>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "#000",
                border: "1px solid #727272",
                marginBottom: "6px",
              }}
            ></Box>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "yellow",
                marginBottom: "6px",
              }}
            ></Box>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "#000",
                border: "1px solid #727272",
                marginBottom: "6px",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              wordBreak: "break-word",
              fontFamily: "Rajdhani SemiBold",
              fontSize: "120px",
              lineHeight: "120px",
              "-webkit-text-stroke": "2px rgba(195, 212, 165, 0.3)",
              color: "#000",
            }}
          >
            02
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "17px",
              fontWeight: "500",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            The boost is collectively sourced from $BLUR stakers, eliminating
            the need for you to manage personal locking.
          </Box>
        </Box>
      </Box>
      <Box
        sx={{ height: "100vh", backgroundColor: "#000", position: "relative" }}
      >
        <img
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
          src={Pig}
        />
        <Box
          sx={{
            paddingTop: isMobile ? "0" : "140px",
            textAlign: "left",
            paddingLeft: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Box
            sx={{
              width: isMobile ? "100%" : "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "50px",
              fontWeight: "500",
              lineHeight: "40px",
              textalign: "left",
            }}
          >
            {`Earn More By `}
            <span
              style={{
                fontFamily: "Rajdhani SemiBold",
                color: "rgba(252, 252, 3, 1)",
              }}
            >
              {`Locking Burst`}
            </span>
          </Box>
          <Link to="/stake">
            <YellowButton
              sx={{
                marginTop: "26px",
                width: "184px",
                fontFamily: "Rajdhani SemiBold",
                fontSize: "24px",
                color: "#000",
                height: "48px",
              }}
            >
              <img src={LaunchIcon} style={{ width: "24px" }} />
              Launch APP
            </YellowButton>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            paddingRight: "10%",
          }}
        >
          <img style={{ height: "180px", width: "auto" }} src={Dots} />
          <Box sx={{ textAlign: "right" }}>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "#000",
                border: "1px solid #727272",
                marginBottom: "6px",
              }}
            ></Box>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "#000",
                border: "1px solid #727272",
                marginBottom: "6px",
              }}
            ></Box>
            <Box
              sx={{
                width: "20px",
                height: "6px",
                background: "yellow",
                marginBottom: "6px",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              wordBreak: "break-word",
              fontFamily: "Rajdhani SemiBold",
              fontSize: "120px",
              lineHeight: "120px",
              "-webkit-text-stroke": "2px rgba(195, 212, 165, 0.3)",
              color: "#000",
            }}
          >
            03
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "17px",
              fontWeight: "500",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            vlBURST (vote-lock BURST) earns a portion of the platform blur
            points + $BURST
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#000",
          position: "relative",
          textAlign: "right",
        }}
      >
        <Box
          sx={{
            paddingTop: isMobile ? "0" : "140px",
            paddingLeft: "10%",
            paddingRight: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
        </Box>
        <Box
          sx={{
            width: "100%",
            paddingRight: "10%",
            wordBreak: "break-word",
            textTransform: "uppercase",
            fontFamily: "Rajdhani",
            fontSize: "50px",
            fontWeight: "500",
            lineHeight: "40px",
            textalign: "left",
          }}
        >
          <span
            style={{
              fontFamily: "Rajdhani SemiBold",
              color: "rgba(252, 252, 3, 1)",
            }}
          >
            {`How  `}
          </span>
          {`It Works `}
        </Box>
        <Stack
          direction={isMobile ? "column" : "row"}
          sx={{ flexWrap: isMobile ? "" : "wrap", padding: "0 10%" }}
        >
          <Box
            sx={{
              flex: "1 1 0px",
              margin: "1rem",
            }}
          >
            <Box
              sx={{
                width: "60px",
                borderRadius: "6px 0 6px 0",
                background: "rgba(252, 252, 3, 1)",
                color: "#000",
                textAlign: "center",
                fontFamily: "Rajdhani Bold",
              }}
            >
              STEP-1
            </Box>
            <Box sx={{ flex: "1 1 0px", textAlign: "left" }}>
              <img src={firstImg} />
            </Box>
            <Box textAlign={"left"}>Deposit any amount of Blur to Burst</Box>
          </Box>
          <Box
            sx={{
              flex: "1 1 0px",
              margin: "1rem",
            }}
          >
            <Box
              sx={{
                width: "60px",
                borderRadius: "6px 0 6px 0",
                background: "rgba(252, 252, 3, 1)",
                color: "#000",
                textAlign: "center",
                fontFamily: "Rajdhani Bold",
              }}
            >
              STEP-2
            </Box>
            <Box sx={{ flex: "1 1 0px", textAlign: "left" }}>
              <img src={secondImg} />
            </Box>
            <Box textAlign={"left"}>
              Receive wBlur tokens in exchange for providing Blur
            </Box>
          </Box>
          <Box
            sx={{
              flex: "1 1 0px",
              margin: "1rem",
            }}
          >
            <Box
              sx={{
                width: "60px",
                borderRadius: "6px 0 6px 0",
                background: "rgba(252, 252, 3, 1)",
                color: "#000",
                textAlign: "center",
                fontFamily: "Rajdhani Bold",
              }}
            >
              STEP-3
            </Box>
            <Box sx={{ flex: "1 1 0px", textAlign: "left" }}>
              <img src={thirdImg} />
            </Box>
            <Box textAlign={"left"}>
              Receive Burst governance token and BHP(Blur Holder Point) as
              future airdrop redemption vouchers
            </Box>
          </Box>
          <Box
            sx={{
              flex: "1 1 0px",
              margin: "1rem",
            }}
          >
            <Box
              sx={{
                width: "60px",
                borderRadius: "6px 0 6px 0",
                background: "rgba(252, 252, 3, 1)",
                color: "#000",
                textAlign: "center",
                fontFamily: "Rajdhani Bold",
              }}
            >
              STEP-4
            </Box>
            <Box sx={{ flex: "1 1 0px", textAlign: "left" }}>
              <img src={fourthImg} />
            </Box>
            <Box textAlign={"left"}>Lock Burst to earn platform fees</Box>
          </Box>
        </Stack>
        <Box sx={{ textAlign: "left", padding: "0 10%" }}>
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Stack
            direction={isMobile ? "column" : "row"}
            sx={{ justifyContent: "space-between" }}
          >
            <Box
              sx={{
                width: "300px",
                wordBreak: "break-word",
                textTransform: "uppercase",
                fontFamily: "Rajdhani",
                fontSize: "50px",
                fontWeight: "500",
                lineHeight: "40px",
                textalign: "left",
              }}
            >
              {`Supported By`}
            </Box>
            <Stack direction={"row"} sx={{ flexWrap: "wrap" }}>
              <img style={{ margin: "6px", width: "80px" }} src={sup1} />
              <img style={{ margin: "6px", width: "80px" }} src={sup2} />
              <img style={{ margin: "6px", width: "80px" }} src={question} />
              <img style={{ margin: "6px", width: "80px" }} src={question} />
              <img style={{ margin: "6px", width: "80px" }} src={question} />
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Stack
        sx={{
          width: "100%",
          justifyContent: "center",
          marginTop: "50px",
          paddingBottom: "2rem",
        }}
        direction={"row"}
      >
        <img
          src={XIcon}
          style={{ width: "24px", marginRight: "20px", cursor: "pointer" }}
        />
        <img src={gitbookIcon} style={{ width: "24px", cursor: "pointer" }} />
      </Stack>
      <Audio />
    </Box>
  );
};

export default ScrollPagination;
