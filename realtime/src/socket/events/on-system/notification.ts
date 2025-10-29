import { ioServer } from "@/socket/server";
import type { Socket } from "socket.io";

export const addNotification = async (socket: Socket) => {
  socket.on("x-notify-all", async (data) => {
    const socketsConnected = await ioServer.fetchSockets();
    socketsConnected.forEach((s) => {
      s.emit("notification", { title: data.title, content: data.content });
    });
  });
};
