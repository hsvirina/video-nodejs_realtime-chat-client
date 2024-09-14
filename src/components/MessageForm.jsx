import { useEffect, useState } from "react";
import { getAllMessagesByRoomId, getAllRooms } from "../services/api";
import { UserProfile } from "./UserProfile";

export function MessageForm({ userName }) {
  const [rooms, setRooms] = useState([]);
  const [roomForJoining, setRoomForJoining] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getAllRooms().then(response => {
      setRooms(response.data);
    })
  }, [userName])

  useEffect(() => {
    if (!roomForJoining) return;
    const roomIdForJoining = rooms.find(room => room.name === roomForJoining);
    if (!roomIdForJoining) return;

    getAllMessagesByRoomId(+roomIdForJoining.id)
      .then(response => {
        setMessages(response.data);
      })
  }, [roomForJoining, rooms]);


  const socket = new WebSocket(`ws://localhost:3005`);

socket.onopen = () => {
  console.log('Connected to WebSocket server');
};

function sendData(message, name, room) {
  socket.send(
    JSON.stringify({
      message,
      name,
      room,
    }),
  );
}

const handleCreateNewMessage = async (event) => {
  event.preventDefault();
  const trimmedMessage = newMessage.trim();
  if (!trimmedMessage) {
    return;
  }
  const roomId = rooms.find(room => room.name === roomForJoining).id;
  const newMessageData = {
    author: userName,
    text: trimmedMessage,
    roomId: +roomId,
  };
  sendData(newMessageData);
  setNewMessage('');
};

useEffect(() => {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received message:', data);
    setMessages(prevMessages => [data, ...prevMessages]);
  };
}, []);

  return (
    <>
      <ul className="rooms">
        {rooms.map(room => (
          <li key={room.id}>
            key={room.id} {room.name}
          </li>
        ))}
      </ul>

      <UserProfile rooms={rooms} setRooms={setRooms}/>

      <form className="field is-horizontal">
        <div className="select is-rounded">
          <select
            className="select is-rounded"
            value={roomForJoining}
            onChange={event => setRoomForJoining(event.target.value)}
          >
            <option>Select Room for join</option>
            {rooms.map(room => (
              <option key={room.id} value={room.name}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      {!!roomForJoining && (
        <>
          <form className="field is-horizontal" onSubmit={handleCreateNewMessage}>
            <input
              type="text"
              className="input is-rounded"
              id="message"
              value={newMessage}
              onChange={event => setNewMessage(event.target.value)}
            />
            <button
              className="button is-link is-outlined is-rounded"
            >
              Send
            </button>
          </form>
        </>
      )}
      {(!!roomForJoining && messages.length === 0) && (
        <h3>
          No messages at this room
        </h3>
      )}

      {(!!roomForJoining && messages.length !== 0) && (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.text}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
