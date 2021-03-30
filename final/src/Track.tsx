import React, { useEffect, useRef } from 'react';
import { AudioTrack, VideoTrack } from 'twilio-video';
import * as faceapi from '@vladmandic/face-api';

function Track(props: { track: AudioTrack | VideoTrack }) {
  let divRef = useRef<HTMLDivElement>(null);
  let canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  let localVideoRef = useRef<HTMLVideoElement>();
  let requestRef = useRef<number>();

  canvasRef.current.width = 640;
  canvasRef.current.height = 480;

  useEffect(() => {
    function drawFilter() {
      let ctx = canvasRef.current?.getContext('2d');
      let image = new Image();
      image.src = 'sunglasses.png';

      async function step() {
        console.log('mylog:', 'step');
        const results = await faceapi.detectAllFaces(localVideoRef.current);
        ctx?.drawImage(localVideoRef.current!, 0, 0);
        results.map(result => {
          ctx?.drawImage(
            image,
            result.box.x + 15,
            result.box.y + 30,
            result.box.width,
            result.box.width * (image.height / image.width)
          );
        });
        requestRef.current = requestAnimationFrame(step);
      }

      requestRef.current = requestAnimationFrame(step);
    }

    faceapi.nets.ssdMobilenetv1.loadFromUri('/model').then(() => {
      faceapi.nets.faceRecognitionNet.loadFromUri('/model').then(() => {
        if (props.track !== null) {
          divRef.current?.classList.add(props.track.kind);
          if (props.track.kind === 'video') {
            localVideoRef.current = props.track.attach() as HTMLVideoElement;
            localVideoRef.current?.addEventListener('playing', drawFilter);
    
            divRef.current?.appendChild(canvasRef.current);
    
            return () => {
              localVideoRef.current?.removeEventListener('playing', drawFilter);
              cancelAnimationFrame(requestRef.current!);
            }
          } else {
            const child = props.track.attach();
            divRef.current?.appendChild(child);
          }
        };
      });
    });
  }, []);

  return (
    <div className="track" ref={divRef}></div>
  );
}

export default Track;