import { ioServer } from "@/infra/socket.io/server";
import type { OrderDTO } from "@/types/dtos";

export const task_orderCreated = async (data: { order: OrderDTO }) => {
  const socketList = await ioServer.in("authenticated").fetchSockets();
  for (const socket of socketList) {
    if (socket.data.id == data.order.customerId) {
      socket.emit("notification", {
        title: "Pedido realizado!",
        content: "Aguarde por atualizações de status do pedido.",
      });
    }
  }
};
