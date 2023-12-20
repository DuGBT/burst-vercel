import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import bgAudio from "./assets/BattleMetal-320bit(chosic.com).mp3";
import startToPlay from "./assets/start-to-play.svg";
import PlayingIcon from "./assets/playing.svg";
import paused from "./assets/playButton.svg";
const Audio = () => {
  const audioElement = document.querySelector("#audio");
  const [playing, setPlaying] = useState(false);
  const [end, setEnd] = useState(true);
  useEffect(() => {
    audioElement.src = bgAudio;
    audioElement.addEventListener("ended", () => {
      setEnd(true);
    });
  }, []);
  return (
    <Box
      id="audio-control"
      sx={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        width: "50px",
        height: "50px",
        cursor: "pointer",
        zIndex: "200",
        // background: "yellow",
        borderRadius: "30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        console.log(audioElement.volume);
        audioElement.volume = 0.6;
        if (audioElement.currentTime === 0 || audioElement.ended) {
          audioElement.play();
          setPlaying(true);
          setEnd(false);
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
      <img
        style={{ width: "100%" }}
        src={end ? startToPlay : playing ? PlayingIcon : paused}
      ></img>
    </Box>
  );
};

export default Audio;
