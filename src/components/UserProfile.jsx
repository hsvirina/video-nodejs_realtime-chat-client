import { useState } from "react";
import { createNewRoom, getAllRooms, deleteRoom, updateRoomName } from "../services/api";

export function UserProfile({ rooms, setRooms }) {
  const [newRoom, setNewRoom] = useState('');
  const [deleteRoomName, setDeleteRoomName] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [roomForRename, setRoomForRename] = useState('');  

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    const newNameForRoom = newRoom.trim();
    if (!newNameForRoom) {
      return;
    }
    await createNewRoom(newNameForRoom)
    getAllRooms().then(res => {
      setRooms(res.data);      
    })

    setNewRoom('');
  };

  const handleDeleteRoom = async (event) => {
    event.preventDefault()
    if (!deleteRoomName.trim()) {
      return;
    }
    const deleteRoomId = rooms.find(room => room.name === deleteRoomName).id      
    if (!deleteRoomId) {
      throw new Error('Room not found');
    }
    await deleteRoom(deleteRoomId)  
    getAllRooms().then(res => {
        setRooms(res.data);      
    })
    setDeleteRoomName('')
  };

  const handleUpdateRoom = async (event) => {
    event.preventDefault();
    const newNameForRoom = newRoomName.trim();
    if (!newNameForRoom) {
      return;
    }
    const roomIdToUpdate = rooms.find(room => room.name === roomForRename).id;
    await updateRoomName(roomIdToUpdate, newNameForRoom);
    getAllRooms().then(res => {
      setRooms(res.data);      
    })
    setNewRoomName('')
  };

  return (
    <div>      
      <form
        className="field is-horizontal"
        onSubmit={handleCreateRoom}
      >
        <input
          type="text"
          className="input is-rounded"
          placeholder="Write name for your new Room"
          value={newRoom}
          onChange={event => setNewRoom(event.target.value)}
        />
        <button
          className="button is-link is-outlined is-rounded"
          type="submit"
        >
          Create new Room
        </button>
      </form> 

      <form className="field is-horizontal" onSubmit={handleDeleteRoom}>
        <div className="select is-rounded">
          <select
            className="select is-rounded"
            value={deleteRoomName}
            onChange={event => setDeleteRoomName(event.target.value)}
          >
            <option>Select Room for deleting</option>
            {rooms.map(room => (
              <option key={room.id} value={room.name}>
                {room.name}
            </option>
            ))}
          </select>
        </div>
        <button
          className="button is-link is-outlined is-rounded"
          type="submit"
        >
          Delete Room
        </button>
      </form>

      <form className="field is-horizontal" onSubmit={handleUpdateRoom}>
        <div className="select is-rounded">
          <select
            className="select is-rounded"
            value={roomForRename}
            onChange={event => setRoomForRename(event.target.value)}
          >           
            <option>Select Room for renaming</option>
            {rooms.map(room => (
              <option key={room.id} value={room.name}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          className="input is-rounded"
          placeholder="Write new Room's name for renaming"
          value={newRoomName}
          onChange={event => setNewRoomName(event.target.value)}
        />
        <button
          className="button is-link is-outlined is-rounded"
          type="submit"
        >
          Rename Room
        </button>
      </form>  
    </div>
  );
}