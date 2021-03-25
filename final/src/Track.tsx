import React, { useEffect } from 'react';
import { AudioTrack, VideoTrack } from 'twilio-video';

function Track(props : {track : AudioTrack | VideoTrack}) {
  let ref : HTMLDivElement

  useEffect(() => {
    if (props.track !== null) {
      const child = props.track.attach();
      ref.classList.add(props.track.kind);
      ref.appendChild(child);
    }
  }, []);
  
  return (
    <div className="track" ref={(node : HTMLDivElement) => ref = node}></div>
  );
}

export default Track;