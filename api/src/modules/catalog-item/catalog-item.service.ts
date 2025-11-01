import { BadResponse } from "@/infra/http/error-handler";
import { CatalogItemDTO } from "@/types/dtos";
import {
  ICatalogItemRepository,
  ILaundryRepository,
} from "@/types/repositories";

export class CatalogItemService {
  constructor(
    private repository: ICatalogItemRepository,
    private laundryRepository: ILaundryRepository,
  ) {}

  async createItem(
    laundryId: string,
    data: Omit<CatalogItemDTO, "id" | "laundryId">,
  ): Promise<CatalogItemDTO> {
    if (!(await this.laundryRepository.findById(laundryId)))
      throw new BadResponse("Lavanderia não encontrada!", 404);

    const dataToBeSaved = { ...data, laundryId };
    const created = await this.repository.create(dataToBeSaved);
    return created;
  }

  async deleteItem(id: string): Promise<void> {
    if (!(await this.repository.findById(id)))
      throw new BadResponse("Item não encontrado!", 404);

    await this.repository.deleteById(id);
  }

  async findByLaundryId(laundryId: string): Promise<CatalogItemDTO[]> {
    if (!(await this.laundryRepository.findById(laundryId)))
      throw new BadResponse("Lavanderia não encontrada", 404);

    const items = await this.repository.findByLaundryId(laundryId);
    return items;
  }

  async findById(id: string): Promise<CatalogItemDTO> {
    const item = await this.repository.findById(id);
    if (!item) throw new BadResponse("Item não encontrado!", 404);
    return item;
  }

  async updateCatalogItem(
    id: string,
    fields: Omit<CatalogItemDTO, "id" | "laundryId">,
  ) {
    if (!(await this.repository.findById(id)))
      throw new BadResponse("Item não encontrado.", 404);

    await this.repository.updateById(id, fields);
  }
}
