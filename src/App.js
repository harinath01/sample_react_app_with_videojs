import React from 'react';
import { VideoPlayer } from "./VideoPlayer";
import './base.css'

const App = () => {
  const playerRef = React.useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  return (
    <div className="center-container">
      <VideoPlayer
        width={1280}
        height={720}
        srcUrl="https://d384padtbeqfgy.cloudfront.net/transcoded/peBmzxeQ7Mf/video.m3u8"
        onReady={handlePlayerReady}
      />
    </div>
  );
}

export default App;
