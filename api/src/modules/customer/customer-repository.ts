import { randomUUID } from "crypto";
import { ICustomerRepository } from "@/types/repositories";
import { db } from "@/infra/database/conn";
import tables from "@/infra/database/tables";
import { CustomerModel } from "@/types/models";
import { eq } from "drizzle-orm";

export class CustomerRepository implements ICustomerRepository {
  public async save(data: Omit<CustomerModel, "id">): Promise<CustomerModel> {
    const result = await db
      .insert(tables.customer)
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
      .from(tables.customer)
      .where(eq(tables.customer.doc_blind_index, doc));
    return result[0];
  }

  public async findByEmail(email: string): Promise<CustomerModel> {
    const result: CustomerModel[] = await db
      .select()
      .from(tables.customer)
      .where(eq(tables.customer.email_blind_index, email));

    return result[0];
  }

  public async findById(id: string): Promise<CustomerModel> {
    const result: CustomerModel[] = await db
      .select()
      .from(tables.customer)
      .where(eq(tables.customer.id, id));

    return result[0];
  }

  public async delete(id: string): Promise<void> {
    await db.delete(tables.customer).where(eq(tables.customer.id, id));
  }

  public async update(
    updates: Partial<Omit<CustomerModel, "id">>,
    id: string,
  ): Promise<void> {
    await db
      .update(tables.customer)
      .set(updates)
      .where(eq(tables.customer.id, id));
  }

  public async listAllIds(): Promise<{ id: string }[]> {
    const result = await db
      .select({ id: tables.customer.id })
      .from(tables.customer);
    return result;
  }
}
