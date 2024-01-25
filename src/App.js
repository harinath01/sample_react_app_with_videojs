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
        orgCode="6eafqn"
        assetId="YtuNKqjgK9D"
        accessToken="fd591e6b-be1d-4703-929a-a6188540cfed"
        hlsUrl="https://d384padtbeqfgy.cloudfront.net/transcoded/YtuNKqjgK9D/video.m3u8" 
        dashUrl="https://d384padtbeqfgy.cloudfront.net/transcoded/YtuNKqjgK9D/video.mpd"
        onReady={handlePlayerReady}
      />
    </div>
  );
}

export default App;
