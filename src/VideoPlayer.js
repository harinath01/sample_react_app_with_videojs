import './base.css';
import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels/dist/videojs-contrib-quality-levels.js';
import 'videojs-http-source-selector/dist/videojs-http-source-selector.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = (props) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { srcUrl, onReady, width, height } = props;

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: srcUrl,
            type: 'application/x-mpegURL',
        }],
    };

    useEffect(() => {
        const initializePlayer = () => {
            const videoElement = document.createElement('video-js');
            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = videojs(videoElement, videoJsOptions, () => {
                onReady && onReady(player);
            });

            playerRef.current = player;
        };

        const updatePlayer = () => {
            const player = playerRef.current;
            player.autoplay(videoJsOptions.autoplay);
            player.src(videoJsOptions.sources);
        };

        if (!playerRef.current) {
            initializePlayer();
        } else {
            updatePlayer();
        }
    }, [videoJsOptions, onReady]);

    useEffect(() => {
        const player = playerRef.current;

        if (player) {
            player.httpSourceSelector();
        }

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player style={{ width: `${width}px`, height: `${height}px` }}>
            <div ref={videoRef} />
        </div>
    );
};

export { VideoPlayer };
