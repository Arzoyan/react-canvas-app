import React, { useEffect, useMemo, useRef, useState } from "react";
import { INITIAL_COUNT_OF_PLAYERS, PLAYER_REF, SOURCE } from "./constants";

import Video from "./Video";
import VideoCanvas from "./VideoCanvas";

export const MainPage = () => {
  const [connectedVideos, setConnectedVideos] = useState({ 0: false });
  const [countOfPlayers, setCountOfPlayers] = useState(
    INITIAL_COUNT_OF_PLAYERS
  );

  const playerRef = useRef(PLAYER_REF);
  const timer = useRef(null);

  const updateCount = () => {
    timer.current = setInterval(() => {
      setCountOfPlayers((prevCount) => prevCount + 1);
    }, 30000);

    if (countOfPlayers >= 3) {
      clearInterval(timer.current);
    }
  };

  useEffect(() => {
    !timer.current && updateCount();
    return () => {
      if (countOfPlayers >= 3) {
        clearInterval(timer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countOfPlayers > 1) {
      for (let i = 1; i < countOfPlayers; i++) {
        playerRef.current[`player${i}`]?.current.pause();
      }
    }
  }, [connectedVideos]);

  const videos = useMemo(() => {
    if (countOfPlayers === 1) {
      return [SOURCE];
    }

    const videoList = [];
    for (let i = 0; i < countOfPlayers; i++) {
      videoList.push({ ...SOURCE, id: i });
    }
    if (countOfPlayers >= 3) {
      clearInterval(timer.current);
      timer.current = null;
    }
    return videoList;
  }, [countOfPlayers]);

  return (
    <>
      {videos.length &&
        videos.map((item, index) => {
          return (
            <Video
              key={item.id}
              ref={playerRef.current[`player${index + 1}`]}
              source={item}
              onMounted={() => {
                setConnectedVideos({ [index + 1]: true });
                playerRef.current[`player${index + 1}`]?.current.play();
              }}
            />
          );
        })}
      {videos.length &&
        playerRef.current[`player${videos.length}`]?.current &&
        connectedVideos[videos.length] &&
        videos.map((_, index) => {
          return (
            <VideoCanvas
              itemCount={countOfPlayers}
              key={index + "0"}
              videoNumber={index + 1}
              player={playerRef.current[`player${index + 1}`]?.current}
            />
          );
        })}
    </>
  );
};
