import type { Socket } from "socket.io";
import { axiosApi } from "@/infra/api/axios-api";
import { fetchMemberLaundries } from "@/infra/api/fetch-member-laundries";

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
      // Create an channel for each laundry
      const laundries = await fetchMemberLaundries(socket.data.id);
      if (laundries != null && laundries.length > 0) {
        laundries.forEach((l) => {
          socket.join(`laundry:${l.id}`);
        });
        return;
      }

      socket.emit("notification", {
        title: "Você não está associado a nenhuma lavanderia.",
        content: "Não receberá atualizações de sua equipe.",
      });
    }
  });
};
