import { createCustomerNotification } from "@/infra/api/create-notification";
import { ioServer } from "@/infra/socket.io/server";
import type { OrderDTO } from "@/types/dtos";

export const task_orderCreated = async (data: { order: OrderDTO }) => {
  let notificationData = {
    title: "Pedido realizado!",
    content: "Aguarde por atualizações de status do pedido.",
    type: "order-created",
    status: "not-sent",
    metadata: {
      orderId: data.order.id,
    },
  };

  const socketList = await ioServer.in("authenticated").fetchSockets();
  for (const socket of socketList) {
    if (socket.data.id == data.order.customerId) {
      notificationData.status = "unread";
      socket.emit("notification", notificationData);
    }
  }

  const createNotification = createCustomerNotification(
    data.order.customerId,
    notificationData
  );

  ioServer.in(`laundry:${data.order.laundryId}`).emit("notification", {
    title: "Pedido recebido!",
    content: `Confira os detalhes de seu novo pedido.`,
    type: "order-created",
    status: "unread",
    metadata: {
      orderId: data.order.id,
    },
  });

  await createNotification;
};
