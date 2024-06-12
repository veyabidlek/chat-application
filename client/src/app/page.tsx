"use client";
import Image from "next/image";
import { useState } from "react";
import { io, Socket } from "socket.io-client";

import Chat from "./chat";
import "./App.css";

const socket: Socket = io("http://localhost:3001");

interface ChatProps {
  socket: Socket;
  username: string;
  room: string;
}
export default function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [room, setRoom] = useState("");
  const joinRoom = () => {
    if (!username || !room) {
      return;
    }
    socket.emit("join_room", room); //pass room as data to backend
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a Chat</h3>
          <input
            type="text"
            className=""
            placeholder="Name..."
            onChange={(event) => setUsername(event.target.value)} //whenever there is a change setUsername changes username to that value
          />
          <input
            type="text"
            className=""
            placeholder="Room ID"
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
      ;
    </div>
  );
}
