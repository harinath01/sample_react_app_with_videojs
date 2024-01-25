import './base.css';
import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';
import 'videojs-contrib-eme';
import 'video.js/dist/video-js.css';

const isRequestFromSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const base64EncodeUint8Array = (input) => btoa(String.fromCharCode.apply(null, input));

const getKeySystems = (orgCode, assetId, accessToken) => {
    const widevineKeySystem = {
        "com.widevine.alpha": {
            getLicense: function (emeOptions, keyMessage, callback) {
                const headers = { "Content-type": "application/octet-stream" };
                const body = keyMessage;

                videojs.xhr({
                    url: `https://app.tpstreams.com/api/v1/${orgCode}/assets/${assetId}/drm_license/?access_token=${accessToken}`,
                    method: "POST",
                    body,
                    responseType: "arraybuffer",
                    headers,
                }, function (err, response, responseBody) {
                    if (err || (response.statusCode >= 400 && response.statusCode <= 599)) {
                        callback(err || {});
                        return;
                    }

                    callback(null, responseBody);
                });
            },
        },
    };

    const fairplayKeySystem = {
        "com.apple.fps.1_0": {
            certificateUri: "https://static.testpress.in/static/fairplay.cer",
            getContentId: function (emeOptions, initData) {
                return new TextDecoder("utf-16").decode(initData.slice(16));
            },
            getLicense: function (emeOptions, contentId, keyMessage, callback) {
                const headers = { "Content-type": "application/json" };
                const body = JSON.stringify({ spc: base64EncodeUint8Array(keyMessage) });

                videojs.xhr({
                    url: `https://app.tpstreams.com/api/v1/${orgCode}/assets/${assetId}/drm_license/?access_token=${accessToken}&drm_type=fairplay`,
                    method: "POST",
                    body,
                    responseType: "arraybuffer",
                    headers,
                }, function (err, response, responseBody) {
                    if (err || (response.statusCode >= 400 && response.statusCode <= 599)) {
                        callback(err || {});
                        return;
                    }

                    callback(null, responseBody);
                });
            },
        },
    };

    return { ...widevineKeySystem, ...fairplayKeySystem };
};

const VideoPlayer = (props) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { hlsUrl, dashUrl, orgCode, assetId, accessToken, onReady, width, height } = props;

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: isRequestFromSafari() ? hlsUrl : dashUrl,
            type: isRequestFromSafari() ? 'application/x-mpegURL' : "application/dash+xml",
            keySystems: getKeySystems(orgCode, assetId, accessToken),
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
    }, [props, videoRef]);

    useEffect(() => {
        const player = playerRef.current;

        if (player) {
            player.httpSourceSelector();
            player.eme();
        }

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player style={{ width: `${width}px`, height: `${height}px` }}>
            <div ref={videoRef} />
        </div>
    );
};

export { VideoPlayer };
