import type { NotificationDTO } from "@/types/dtos";
import { axiosApi } from "./axios-api";

type NotificationCreation = {
  type: string;
  metadata: any;
  title: string;
  content: string;
};

export const createCustomerNotification = async (
  customerId: string,
  data: NotificationCreation
): Promise<NotificationDTO | null> => {
  const response = await axiosApi.post(
    `/customers/${customerId}/notifications`,
    {
      notification: data,
    }
  );

  if (response.status == 201) {
    const created: NotificationDTO = response.data.notification_created;
    return created;
  }

  return null;
};
