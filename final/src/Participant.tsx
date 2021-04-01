import React, { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant, LocalTrackPublication, RemoteTrackPublication, VideoTrack, AudioTrack, LocalDataTrack, DataTrack } from 'twilio-video';
import Track from './Track';
import FilterMenu from './FilterMenu';

function Participant(props: { localParticipant: boolean, participant: LocalParticipant | RemoteParticipant }) {
  const existingPublications = Array.from<LocalTrackPublication | RemoteTrackPublication>(props.participant.tracks.values());
  const existingTracks = existingPublications.map(publication => publication.track);
  const nonNullTracks = existingTracks.filter(track => track !== null);

  const [tracks, setTracks] = useState(nonNullTracks);
  const [filter, setFilter] = useState('Sunglasses');

  useEffect(() => {
    if (!props.localParticipant) {
      props.participant.on('trackSubscribed', track => {
        setTracks(prevState => ([...prevState, track]));
      });
      props.participant.on('trackPublished', track => {
        setTracks(prevState => ([...prevState, track]));
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="participant" id={props.participant.identity}>
      <div className="identity">{props.participant.identity}</div>
      {
        props.localParticipant
        ? <FilterMenu changeFilter={(filter) => {
            const dataTrack = tracks.find(track => track!.kind === 'data') as LocalDataTrack;
            dataTrack!.send(filter);
            setFilter(filter);
          }} />
        : ''
      }

      {
        tracks.map((track) =>
          <Track key={track!.name} track={(track as VideoTrack | AudioTrack | DataTrack)} filter={filter} setFilter={setFilter}/>)
      }
    </div>
  )
}

export default Participant;