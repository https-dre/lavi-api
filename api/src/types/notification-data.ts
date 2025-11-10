type OrderNotification = {
  orderId: string;
};

type NewCommentData = {
  postId: string;
};

export type NotificationMetadata =
  | OrderNotification
  | NewCommentData
  | { [key: string]: any };
