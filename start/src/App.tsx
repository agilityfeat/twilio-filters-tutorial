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
            <input placeholder="What's your name?"/>
            <button onClick={async () => {
              try {
                const response = await fetch(`https://{your-endpoint}?identity=${identity}`);
                const data = await response.json();
                const room = await connect(data.accessToken, {
                  name: 'cool-room',
                  audio: true,
                  video: true
                });
            
                setRoom(room);
              } catch(err) {
                console.log(err);
              }
            }}>Join Room</button>
          </div>
        : <Room room={room} returnToLobby={() => {
            setRoom(undefined);
          }} />
      }
    </div>
  );
}

export default App;
