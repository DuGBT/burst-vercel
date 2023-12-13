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

const YellowButton = styled(Button)({
  "&.MuiButton-root": { background: "yellow !important" },
});
const ScrollPagination = () => {
  const containerRef = useRef(null);
  window.burstLoaded = false;
  return (
    <Box
      id="test"
      ref={containerRef}
      sx={{
        // height: "100vh",

        // overflowY: "auto",
        // scrollBehavior: "smooth",
        // touchAction: "pan-y",
        position: "relative",
      }}
    >
      <Header></Header>
      <Box
        sx={{
          position: "absolute",
          top: 400,
          zIndex: "2",
          textAlign: "left",
          width: "100%",
          paddingLeft: "10%",
        }}
      >
        <Box
          sx={{
            textAlign: "left",
            width: "620px",
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
            width: "620px",
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
            <img src={LaunchIcon} />
            Launch APP
          </YellowButton>
        </Link>
      </Box>
      <Box
        sx={{
          maxHeight: "100vh",

          height: "100vh",
          backgroundColor: "#000",
        }}
      >
        <video
          autoPlay
          muted
          loop
          style={{ height: "100%", width: "100%", objectFit: "fill" }}
        >
          <source src={BurstVideo} type="video/mp4" />
        </video>
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
          src={Isolamento}
        />
        <Box
          sx={{
            paddingTop: "170px",
            textAlign: "left",
            paddingLeft: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Box
            sx={{
              width: "500px",
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
          <img style={{ height: "180px" }} src={Dots} />
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
              width: "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "17px",
              fontWeight: "500",
              textAlign: "left",
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
            paddingTop: "170px",
            textAlign: "left",
            paddingLeft: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Box
            sx={{
              width: "500px",
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
          <img style={{ height: "180px" }} src={Dots} />
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
              // textAlign: "left",
              // width: "620px",
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
              width: "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "17px",
              fontWeight: "500",
              textAlign: "left",
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
            paddingTop: "170px",
            textAlign: "left",
            paddingLeft: "10%",
          }}
        >
          <img style={{ width: "40px" }} src={BurstIconBlack} />
          <Box
            sx={{
              width: "400px",
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
              <img src={LaunchIcon} />
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
          <img style={{ height: "180px" }} src={Dots} />
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
              width: "500px",
              wordBreak: "break-word",
              textTransform: "uppercase",
              fontFamily: "Rajdhani",
              fontSize: "17px",
              fontWeight: "500",
              textAlign: "left",
            }}
          >
            vlBURST (vote-lock BURST) earns a portion of the platform blur
            points + $BURST
          </Box>
          <Stack
            sx={{
              width: "100%",
              justifyContent: "center",
              marginTop: "100px",
              marginBottom: "2rem",
            }}
            direction={"row"}
          >
            <img
              src={XIcon}
              style={{ width: "24px", marginRight: "20px", cursor: "pointer" }}
            />
            <img
              src={gitbookIcon}
              style={{ width: "24px", cursor: "pointer" }}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ScrollPagination;
