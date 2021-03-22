import React, { useState } from 'react';
import { connect, Room as RoomType } from 'twilio-video';
import Room from './Room';
import './App.css';

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
                  const response = await fetch(`https://{your-endpoint}?identity=${identity}`);
                  const data = await response.json();
                  const room = await connect(data.accessToken, {
                    name: 'cool-room',
                    audio: true,
                    video: true
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
