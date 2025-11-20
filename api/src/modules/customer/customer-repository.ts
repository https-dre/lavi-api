import { randomUUID } from "crypto";
import { ICustomerRepository } from "@/types/repositories";
import { db } from "@/infra/database/conn";
import * as t from "@/infra/database/tables";
import { CustomerModel } from "@/types/models";
import { eq } from "drizzle-orm";

export class CustomerRepository implements ICustomerRepository {
  public async save(data: Omit<CustomerModel, "id">): Promise<CustomerModel> {
    const result = await db
      .insert(t.customer)
      .values({
        id: randomUUID(),
        ...data,
      })
      .returning();

    return result[0];
  }

  public async findByDoc(doc: string): Promise<CustomerModel> {
    const result: CustomerModel[] = await db
      .select()
      .from(t.customer)
      .where(eq(t.customer.doc_blind_index, doc));
    return result[0];
  }

  public async findByEmail(email: string): Promise<CustomerModel> {
    const result: CustomerModel[] = await db
      .select()
      .from(t.customer)
      .where(eq(t.customer.email_blind_index, email));

    return result[0];
  }

  public async findById(id: string): Promise<CustomerModel> {
    const result: CustomerModel[] = await db
      .select()
      .from(t.customer)
      .where(eq(t.customer.id, id));

    return result[0];
  }

  public async delete(id: string): Promise<void> {
    await db.delete(t.customer).where(eq(t.customer.id, id));
  }

  public async update(
    updates: Partial<Omit<CustomerModel, "id">>,
    id: string,
  ): Promise<void> {
    await db
      .update(t.customer)
      .set(updates)
      .where(eq(t.customer.id, id));
  }

  public async listAllIds(): Promise<{ id: string }[]> {
    const result = await db
      .select({ id: t.customer.id })
      .from(t.customer);
    return result;
  }
}
