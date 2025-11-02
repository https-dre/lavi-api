import { ioServer } from "@/socket/server";
import type { Socket } from "socket.io";

export const customEvent = (socket: Socket) => {
  socket.on("x-custom-event", (data) => {
    ioServer.emit(data.eventname, data.eventcontent);
  });
};
