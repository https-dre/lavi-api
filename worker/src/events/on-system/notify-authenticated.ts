import { ioServer } from "@/infra/socket.io/server";
import type { Socket } from "socket.io";

export const notifyAuthenticated = (socket: Socket) => {
  socket.on("auth/x-notify-all", async (data) => {
    const socketsConnected = await ioServer.in("authenticated").fetchSockets();
    socketsConnected.forEach((s) => {
      s.emit("notification", { title: data.title, content: data.content });
    });
  });
};
