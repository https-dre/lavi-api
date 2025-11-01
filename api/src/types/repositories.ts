import {
  CustomerModel,
  LaundryModel,
  LaundryBannerModel,
  OrderModel,
  OrderItemModel,
  MemberModel,
  CatalogItemModel,
  FeedbackImageModel,
  FeedbackModel,
} from "./models";

export interface ICustomerRepository {
  save(data: Omit<CustomerModel, "id">): Promise<CustomerModel>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<CustomerModel>;
  findById(id: string): Promise<CustomerModel>;
  update(
    updates: Partial<Omit<CustomerModel, "id">>,
    id: string
  ): Promise<void>;
  findByDoc(doc: string): Promise<CustomerModel>;
  listAllIds(): Promise<{ id: string }[]>;
}

export interface ILaundryRepository {
  save(data: Omit<LaundryModel, "id">): Promise<LaundryModel>;
  delete(id: string): Promise<void>;
  findByCNPJ(cnpj: string): Promise<LaundryModel>;
  findById(id: string): Promise<LaundryModel>;
  findByEmployeeCode(code: string): Promise<LaundryModel>;
  findByMemberId(id: string): Promise<LaundryModel[]>;
  update(id: string, fields: Record<string, any>): Promise<void>;
  searchByName(name: string): Promise<LaundryModel[]>;
  listAll(): Promise<LaundryModel[]>;
}

export interface IMemberRepository {
  save(data: Omit<MemberModel, "id" | "created_at">): Promise<MemberModel>;
  findById(id: string): Promise<MemberModel>;
  findByEmail(email: string): Promise<MemberModel>;
  findByCpf(cpf: string): Promise<MemberModel>;
  findByLaundryId(id: string): Promise<MemberModel[]>;
  listAll(): Promise<MemberModel[]>;
  deleteById(id: string): Promise<void>;
  updateFields(
    id: string,
    fields: Partial<Omit<MemberModel, "id" | "created_at">>
  ): void;
  pushMemberToLaundry(memberId: string, laundryId: string): Promise<void>;
  popMemberLaundry(memberId: string, laundryId: string): Promise<void>;
}

export interface ILaundryBannerRepository {
  save(data: Omit<LaundryBannerModel, "id">): Promise<LaundryBannerModel>;
  delete(id: string): Promise<void>;
  findByLaundryId(id: string): Promise<LaundryBannerModel[]>;
  findById(id: string): Promise<LaundryBannerModel>;
}

export interface IOrderRepository {
  create(
    data: Omit<OrderModel, "id" | "created_at" | "updated_at">
  ): Promise<OrderModel>;
  delete(orderId: string): Promise<void>;
  findByCustomerId(id: string): Promise<OrderModel[]>;
  findByCustomerIdWithCursorIndex(
    id: string,
    cursor: Date
  ): Promise<OrderModel[]>;
  findById(id: string): Promise<OrderModel>;
  findByCustomerIdWithDateInterval(
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<OrderModel[]>;
  findByCustomerIdAndStatus(
    customerId: string,
    status: string
  ): Promise<OrderModel[]>;
  pushOrderItem(item: Omit<OrderItemModel, "id">): Promise<OrderItemModel>;
  pushManyOrderItems(
    items: Omit<OrderItemModel, "id">[]
  ): Promise<OrderItemModel[]>;
  deleteOrderItem(itemId: string): Promise<void>;
  deleteAllItemsFromOrder(id: string): Promise<void>;
  findOrderItemsByOrderId(orderId: string): Promise<OrderItemModel[]>;
  findOrderItemById(id: string): Promise<OrderItemModel>;
  updateFields(
    orderId: string,
    fields: Partial<Omit<OrderModel, "id" | "created_at" | "updated_at">>
  ): Promise<void>;
  findByLaundryId(
    laundryId: string,
    page?: number,
    pageSize?: number
  ): Promise<OrderModel[]>;
}

export interface ICatalogItemRepository {
  findById(id: string): Promise<CatalogItemModel>;
  create(data: Omit<CatalogItemModel, "id">): Promise<CatalogItemModel>;
  deleteById(id: string): Promise<void>;
  updateById(
    id: string,
    fieldsUpdated: Partial<Omit<CatalogItemModel, "id">>
  ): Promise<void>;
  findByLaundryId(laundryId: string): Promise<CatalogItemModel[]>;
}

export interface IFeedbackRepository {
  save(data: Omit<FeedbackModel, "id" | "created_at">): Promise<FeedbackModel>;
  deleteById(id: string): Promise<void>;
  saveImages(
    images: Omit<FeedbackImageModel, "id">[]
  ): Promise<FeedbackImageModel[]>;
  deleteImage(key: string): Promise<void>;
  findWithInnerJoin(
    laundryId: string,
    page?: number,
    pageSize?: number
  ): Promise<any>;
  findByLaundryId(
    laundryId: string,
    page: number,
    pageSize: number
  ): Promise<any>;
  findByCustomerId(
    customerId: string,
    page: number,
    pageSize: number
  ): Promise<FeedbackModel[]>;
  findById(id: string): Promise<FeedbackModel>;
}
