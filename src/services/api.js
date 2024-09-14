import axios from "axios"

export const getAllRooms = () => {
  return axios.get('http://localhost:3005/rooms')
}

export const createNewRoom = (nameRoom) => {
  return axios.post('http://localhost:3005/rooms', {
    name: nameRoom,
  })
}

export const updateRoomName = (roomId, newName) => {
  return axios.patch(`http://localhost:3005/rooms/${roomId}`, { newName });
};

export const deleteRoom = (roomId) => {
  return axios.delete(`http://localhost:3005/rooms/${roomId}`)
}

export const getAllMessagesByRoomId = (roomId) => {
  return axios.get(`http://localhost:3005/messages/${roomId}`);
}

export const createNewMessage = (newMessage) => {
  return axios.post(`http://localhost:3005/messages`, newMessage);
}