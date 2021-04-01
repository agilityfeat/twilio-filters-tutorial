import React, { useEffect, useRef } from 'react';
import { AudioTrack, VideoTrack, DataTrack } from 'twilio-video';
import * as faceapi from '@vladmandic/face-api';

function Track(props: { track: AudioTrack | VideoTrack | DataTrack, filter: string, setFilter: (filter: string) => void }) {
  let divRef = useRef<HTMLDivElement>(null);
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let localAudioRef = useRef<HTMLAudioElement | null>(null);
  let localVideoRef = useRef<HTMLVideoElement | null>(null);
  let requestRef = useRef<number>();

  useEffect(() => {
    function drawFilter() {
      let ctx = canvasRef.current?.getContext('2d');
      let image = new Image();
      image.src = props.filter === 'Sunglasses' ? 'sunglasses.png' : 'sunglasses-style.png';

      async function step() {
        const results = await faceapi.detectAllFaces(localVideoRef.current);
        ctx?.drawImage(localVideoRef.current!, 0, 0);
        // eslint-disable-next-line array-callback-return
        results.map((result) => {
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

    if (props.track) {
      switch (props.track.kind) {
        case 'audio':
          localAudioRef.current = props.track.attach();
          break;
        case 'data':
          props.track.on('message', props.setFilter);
          break;
        case 'video':
          localVideoRef.current = props.track.attach() as HTMLVideoElement;
          localVideoRef.current?.addEventListener('playing', drawFilter);
      }
    }


    return () => {
      if (props.track && props.track.kind === 'video') {
        localVideoRef.current?.removeEventListener('playing', drawFilter);
        cancelAnimationFrame(requestRef.current!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filter]);

  return (
    <div className="track" ref={divRef}>
      {props.track.kind === 'audio' &&
        <audio autoPlay={true} ref={localAudioRef} />
      }
      {props.track.kind === 'video' &&
        <>
          <video autoPlay={true} ref={localVideoRef} />
          <canvas width="640" height="480" ref={canvasRef} />
        </>
      }
    </div>
  );
}

export default Track;