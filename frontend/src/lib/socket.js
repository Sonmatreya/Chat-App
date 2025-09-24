import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chat-app-06fm.onrender.com";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});
