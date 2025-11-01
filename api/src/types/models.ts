import * as tables from "@/infra/database/tables";

export type CustomerModel = Required<typeof tables.customer.$inferInsert>;

export type CustomerAddressModel = typeof tables.customerAddress.$inferInsert;

export type LaundryModel = Required<typeof tables.laundry.$inferInsert>;

export type LaundryBannerModel = typeof tables.laundryBanner.$inferSelect;

export type OrderModel = typeof tables.order.$inferSelect;

export type OrderItemModel = typeof tables.orderItem.$inferInsert;

export type FeedbackModel = typeof tables.feedbackPost.$inferSelect;

export type FeedbackImageModel = typeof tables.feedbackImage.$inferSelect;

export type MemberModel = typeof tables.member.$inferSelect;

export type CatalogItemModel = typeof tables.laundryCatalogItem.$inferSelect;
