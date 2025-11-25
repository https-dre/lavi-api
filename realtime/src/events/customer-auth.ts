import type { Socket } from "socket.io";
import { axiosApi } from "@/infra/api/axios-api";

export const addCustomerAuth = (socket: Socket) => {
  socket.on("customer-auth", async (data) => {
    if (!data.token) {
      return;
    }
    const response = await axiosApi.patch("/customers/auth", {
      token: data.token,
    });
    //console.log(data.token);
    //console.log(response.status);
    if (response.status == 200) {
      socket.data.clientType = "customer";
      socket.data.id = response.data.payload.customerId;
      socket.join("authenticated");
      socket.join("customers");
      socket.join(`user:${socket.data.id}`);
      socket.emit("from-server", {
        info: socket.data,
        message: "Authenticated!",
      });
      return;
    }
    
    socket.emit("from-server", {
      info: {
        authResponseStatus: response.status
      },
      message: "Erro na autenticação"
    })
  });
};
