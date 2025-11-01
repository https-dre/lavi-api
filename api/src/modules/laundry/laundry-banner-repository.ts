import { ILaundryBannerRepository } from "@/types/repositories";
import { db } from "@/infra/database/conn";
import { LaundryBannerModel } from "@/types/models";
import * as t from "@/infra/database/tables";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export class LaundryBannerRepository implements ILaundryBannerRepository {
  async save(
    data: Omit<LaundryBannerModel, "id">,
  ): Promise<LaundryBannerModel> {
    const result = await db
      .insert(t.laundryBanner)
      .values({
        id: randomUUID(),
        ...data,
      })
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db.delete(t.laundryBanner).where(eq(t.laundryBanner.id, id));
  }

  async findByLaundryId(id: string): Promise<LaundryBannerModel[]> {
    const result = await db
      .select()
      .from(t.laundryBanner)
      .where(eq(t.laundryBanner.laundryId, id));
    return result;
  }

  async findById(id: string): Promise<LaundryBannerModel> {
    const result = await db
      .select()
      .from(t.laundryBanner)
      .where(eq(t.laundryBanner.id, id));
    return result[0];
  }
}
