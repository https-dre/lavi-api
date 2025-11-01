import { db } from "@/infra/database/conn";
import { CatalogItemModel } from "@/types/models";
import { ICatalogItemRepository } from "@/types/repositories";
import * as t from "@/infra/database/tables";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export class CatalogRepository implements ICatalogItemRepository {
  async create(data: Omit<CatalogItemModel, "id">): Promise<CatalogItemModel> {
    const created = await db
      .insert(t.laundryCatalogItem)
      .values({
        ...data,
        id: randomUUID(),
      })
      .returning();
    return created[0];
  }
  async deleteById(id: string): Promise<void> {
    await db
      .delete(t.laundryCatalogItem)
      .where(eq(t.laundryCatalogItem.id, id));
  }
  async findById(id: string): Promise<CatalogItemModel> {
    const result = await db
      .select()
      .from(t.laundryCatalogItem)
      .where(eq(t.laundryCatalogItem.id, id));
    return result[0];
  }
  async updateById(
    id: string,
    fieldsUpdated: Partial<Omit<CatalogItemModel, "id">>,
  ): Promise<void> {
    await db
      .update(t.laundryCatalogItem)
      .set(fieldsUpdated)
      .where(eq(t.laundryCatalogItem.id, id));
  }

  async findByLaundryId(laundryId: string): Promise<CatalogItemModel[]> {
    const result = await db
      .select()
      .from(t.laundryCatalogItem)
      .where(eq(t.laundryCatalogItem.laundryId, laundryId));
    return result;
  }
}
