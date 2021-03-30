import React, { useEffect, useRef } from 'react';
import { AudioTrack, VideoTrack } from 'twilio-video';

function Track(props: { track: AudioTrack | VideoTrack }) {
  let divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.track !== null) {
      const child = props.track.attach();
      divRef.current?.classList.add(props.track.kind);
      divRef.current?.appendChild(child);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="track" ref={divRef}></div>
  );
}

export default Track;