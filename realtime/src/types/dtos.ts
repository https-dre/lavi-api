// Data Transfer Object
import {
  zMember,
  zCustomer,
  zLaundry,
  OrderType,
  zCatalogItem,
  zFeedback,
  FeedbackImageType,
  LaundryBannerType,
  zNotification,
} from "./typebox";

export type CustomerDTO = typeof zCustomer.static;

export type LaundryDTO = typeof zLaundry.static;

export type LaundryBannerDTO = typeof LaundryBannerType.static;

export type OrderDTO = typeof OrderType.static;

export type MemberDTO = typeof zMember.static;

export type CatalogItemDTO = typeof zCatalogItem.static;

export type FeedbackDTO = typeof zFeedback.static;

export type FeedbackImageDTO = typeof FeedbackImageType.static;

export type NotificationDTO = typeof zNotification.static;
