import React, { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant, LocalTrackPublication, RemoteTrackPublication, VideoTrack, AudioTrack } from 'twilio-video';
import Track from './Track';

function Participant(props: { localParticipant: boolean, participant: LocalParticipant | RemoteParticipant }) {
  const existingPublications = Array.from<LocalTrackPublication | RemoteTrackPublication>(props.participant.tracks.values());
  const existingTracks = existingPublications.map(publication => publication.track);
  const nonNullTracks = existingTracks.filter(track => track !== null);

  const [tracks, setTracks] = useState(nonNullTracks);

  useEffect(() => {
    if (!props.localParticipant) {
      props.participant.on('trackSubscribed', track => {
        setTracks([...tracks, track]);
      });
    }
  })

  return (
    <div className="participant" id={props.participant.identity}>
      <div className="identity">{props.participant.identity}</div>
      {
        tracks.map((track : VideoTrack | AudioTrack) =>
          <Track key={track!.name} track={track!} />)
      }
    </div>
  )
}

export default Participant;