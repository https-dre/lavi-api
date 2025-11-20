import { OrderItemModel, OrderModel } from "@/types/models";

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