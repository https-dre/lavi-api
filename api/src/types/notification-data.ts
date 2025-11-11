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

export enum NotificationStatus {
  UNREAD = "unread",
  NOT_SENT = "not-sent",
  READED = "readed",
}
