// Data Transfer Object
import {
  MemberType,
  CustomerType,
  LaundryType,
  OrderType,
  CatalogItemType,
  FeedbackType,
  FeedbackImageType,
  LaundryBannerType,
} from "./typebox";

export type CustomerDTO = typeof CustomerType.static;

export type LaundryDTO = typeof LaundryType.static;

export type LaundryBannerDTO = typeof LaundryBannerType.static;

export type OrderDTO = typeof OrderType.static;

export type MemberDTO = typeof MemberType.static;

export type CatalogItemDTO = typeof CatalogItemType.static;

export type FeedbackDTO = typeof FeedbackType.static;

export type FeedbackImageDTO = typeof FeedbackImageType.static;
