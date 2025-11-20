import { CustomerModel } from "@/types/models";

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