import React, { useEffect, useRef, useState } from 'react';
import { connect, createLocalVideoTrack, Room as RoomType } from 'twilio-video';
import * as faceapi from '@vladmandic/face-api';
import Room from './Room';
import './App.css';
import { CanvasElement } from './types';

function App() {
  const [identity, setIdentity] = useState('');
  const [room, setRoom] = useState<RoomType>();

  return (
    <div className="App">
      {
        room === undefined
          ? <div className="lobby">
            <input
              value={identity}
              onChange={(event) => {
                setIdentity(event.target.value);
              }}
              onClick={(event) => {
                event.currentTarget.placeholder = ''
              }}
              placeholder="What's your name?" />
            <button
              disabled={identity === '' ? true : false}
              onClick={async () => {
                try {
                  const response = await fetch(`/token?identity=${identity}`);
                  const data = await response.json();
                  const room = await connect(data.accessToken, {
                    name: 'cool-room',
                    video: { width: 640, height: 480 }
                  });
                  setRoom(room);
                } catch (err) {
                  console.log(err);
                }
              }}>Join Room</button>
          </div>
          : <Room room={room} returnToLobby={() => {
            room.disconnect();
            setRoom(undefined);
          }} />
      }
    </div>
  );
}

export default App;
