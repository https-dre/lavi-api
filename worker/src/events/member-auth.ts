import type { Socket } from "socket.io";
import { axiosApi } from "@/infra/api/axios-api";

export const addMemberAuth = (socket: Socket) => {
  socket.on("member-auth", async (data) => {
    if (!data.token) {
      return;
    }
    const response = await axiosApi.patch("/members/auth", {
      token: data.token,
    });

    if (response.status == 200) {
      socket.data.clientType = "member";
      socket.data.id = response.data.payload.memberId;
      socket.join("authenticated");
      socket.join("members");
      socket.emit("from-server", {
        info: socket.data,
        message: "Authenticated!",
      });
    }
  });
};
