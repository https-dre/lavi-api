import { ioServer } from "@/infra/socket.io/server";

export const isUserOnline = (userId: string) => {
  const room = ioServer.sockets.adapter.rooms.get(`user:${userId}`);
  return room && room.size > 0;
};
