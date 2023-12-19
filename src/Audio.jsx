import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import bgAudio from "./assets/BattleMetal-320bit(chosic.com).mp3";
import playIcon from "./assets/play-fill.svg";
import pauseIcon from "./assets/pause-line.svg";
const Audio = () => {
  const audioElement = document.querySelector("#audio");
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    audioElement.src = bgAudio;
    console.log(audioElement);
    // audioElement.play();
  }, []);
  return (
    <Box
      id="audio-control"
      sx={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        width: "50px",
        height: "50px",
        cursor: "pointer",
        zIndex: "200",
        background: "yellow",
        borderRadius: "30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        console.log(audioElement.ended);
        if (audioElement.currentTime === 0 || audioElement.ended) {
          audioElement.play();
          setPlaying(true);
          return;
        }
        if (
          audioElement.paused &&
          audioElement.currentTime > 0 &&
          !audioElement.ended
        ) {
          audioElement.play();
          setPlaying(true);
        } else {
          audioElement.pause();
          setPlaying(false);
        }
      }}
    >
      <img style={{ width: "32px" }} src={playing ? pauseIcon : playIcon}></img>
    </Box>
  );
};

export default Audio;
