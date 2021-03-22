import React from 'react';
import {LocalParticipant, RemoteParticipant} from 'twilio-video';

function Participant(props : {localParticipant : boolean, participant : LocalParticipant | RemoteParticipant}) {
  return (
    <div></div>
  )
}

export default Participant;