import { io } from "socket.io-client";
const socket = io("ws://localhost:4000");
export const callSocket = (event, data) => {
  socket.emit(event, data);
};
