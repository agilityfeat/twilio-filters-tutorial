import React, { useEffect, useState } from 'react';
import { Room as RoomType } from 'twilio-video';
import Participant from './Participant';

function Room(props: { room: RoomType; returnToLobby: () => void; }) {
  const [remoteParticipants, setRemoteParticipants] = useState(Array.from(props.room.participants.values()));

  useEffect(() => {
    props.room.on('participantConnected', (participant) => {
      console.log(`${participant.identity} has joined the room`);
      setRemoteParticipants(prevState => ([...prevState, participant]));
    });
    props.room.on('participantDisconnected', (participant) => {
      console.log(`${participant.identity} has left the room`);
      setRemoteParticipants(prevState => prevState.filter(p => p.identity !== participant.identity));
    });
    window.addEventListener('beforeunload', props.returnToLobby);

    return props.returnToLobby
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="room">
      <div className="participants">
        <Participant
          key={props.room.localParticipant.identity}
          localParticipant={true}
          participant={props.room.localParticipant} />
        {
          remoteParticipants.map((participant) =>
            <Participant
              key={participant.identity}
              localParticipant={false}
              participant={participant} />
          )
        }
      </div>
      <button id="leaveRoom" onClick={props.returnToLobby}>Leave Room</button>
    </div>
  );
}

export default Room;