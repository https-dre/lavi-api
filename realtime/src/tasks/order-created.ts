import { createCustomerNotification } from "@/infra/api/create-notification";
import { ioServer } from "@/infra/socket.io/server";
import type { OrderDTO } from "@/types/dtos";

export const task_orderCreated = async (data: { order: OrderDTO }) => {
  const notificationData = {
    title: "Pedido realizado!",
    content: "Aguarde por atualizações de status do pedido.",
    type: "order-created",
    metadata: {
      orderId: data.order.id,
    },
  };
  const createNotification = createCustomerNotification(
    data.order.customerId,
    notificationData
  );
  const socketList = await ioServer.in("authenticated").fetchSockets();

  for (const socket of socketList) {
    if (socket.data.id == data.order.customerId) {
      socket.emit("notification", notificationData);
    }
  }
  await createNotification;
};
