import React from 'react';
import { VideoPlayer } from "./VideoPlayer";
import './base.css'
import videojs from 'video.js';

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

    var originalWarn = videojs.log.warn;
    videojs.log.warn = function (message) {
      if (message && message.includes('DRM keystatus changed to "output-restricted."')) {
        player.error({
          code: 3,
          message: "HDMI mirrioring and screen sharing is restricted"
        });
      }
      originalWarn.apply(this, arguments);
    };
    
  }

  return (
    <div className="center-container">
      <VideoPlayer
        width={1280}
        height={720}
        orgCode="352dct"
        assetId="fgf9n8CGeJE"
        accessToken="02fcc48b-7fd6-4b59-a846-43be635aaa06"
        hlsUrl="https://dhe2cd88f2ghy.cloudfront.net/transcoded/fgf9n8CGeJE/video.m3u8" 
        dashUrl="https://dhe2cd88f2ghy.cloudfront.net/transcoded/fgf9n8CGeJE/video.mpd"
        onReady={handlePlayerReady}
      />
    </div>
  );
}

export default App;
