import React from 'react';
import {Room as RoomType} from 'twilio-video';

function Room(props : { room: RoomType | undefined; returnToLobby: () => void; }) {
    return (
        <div></div>
    );
}

export default Room;