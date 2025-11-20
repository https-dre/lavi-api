import { CatalogItemModel } from "@/types/models";

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