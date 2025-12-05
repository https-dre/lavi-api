import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { logger } from "@/config/logger";
import { addNotification } from "@/events/on-system/notification";
import { addCustomerAuth } from "@/events/customer-auth";
import { addMemberAuth } from "@/events/member-auth";
import { notifyAuthenticated } from "@/events/on-system/notify-authenticated";
import { sendMessage } from "@/events/send-message";

const ioServer = new Server();

const engine = new Engine({
  path: "/socket.io/",
});

ioServer.bind(engine);

ioServer.on("connection", async (socket) => {
  logger.info("Socket connected: " + socket.id);
  //logger.info(socket.handshake.headers);
  addCustomerAuth(socket);
  addMemberAuth(socket);
  addNotification(socket);
  notifyAuthenticated(socket);
  sendMessage(socket);
});

export { ioServer };
