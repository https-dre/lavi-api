import { MemberModel } from "@/types/models";
import { IMemberRepository } from "@/types/repositories";
import { db } from "@/infra/database/conn";
import * as t from "@/infra/database/tables";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

export class MemberRepository implements IMemberRepository {
  async save(
    data: Omit<MemberModel, "id" | "created_at">,
  ): Promise<MemberModel> {
    const result = await db
      .insert(t.member)
      .values({
        ...data,
        id: randomUUID(),
      })
      .returning();
    return result[0];
  }
  async findById(id: string): Promise<MemberModel> {
    const result = await db.select().from(t.member).where(eq(t.member.id, id));
    return result[0];
  }
  async findByEmail(email: string): Promise<MemberModel> {
    const result = await db
      .select()
      .from(t.member)
      .where(eq(t.member.email_blind_index, email));
    return result[0];
  }
  async findByCpf(cpf: string): Promise<MemberModel> {
    const result = await db
      .select()
      .from(t.member)
      .where(eq(t.member.cpf_blind_index, cpf));
    return result[0];
  }
  async deleteById(id: string): Promise<void> {
    await db.delete(t.member).where(eq(t.member.id, id));
  }

  async updateFields(
    id: string,
    fields: Partial<Omit<MemberModel, "id" | "created_at">>,
  ) {
    await db.update(t.member).set(fields).where(eq(t.member.id, id));
  }

  async findByLaundryId(id: string): Promise<MemberModel[]> {
    const result = await db
      .select()
      .from(t.member)
      .innerJoin(t.laundry_member, eq(t.member.id, t.laundry_member.memberId))
      .where(eq(t.laundry_member.laundryId, id));
    return result.map((row) => row.members);
  }

  async pushMemberToLaundry(
    memberId: string,
    laundryId: string,
  ): Promise<void> {
    await db.insert(t.laundry_member).values({ memberId, laundryId });
  }

  async popMemberLaundry(memberId: string, laundryId: string): Promise<void> {
    await db
      .delete(t.laundry_member)
      .where(
        and(
          eq(t.laundry_member.laundryId, laundryId),
          eq(t.laundry_member.memberId, memberId),
        ),
      );
  }

  async listAll(): Promise<MemberModel[]> {
    const result = await db.select().from(t.member);
    return result;
  }
}
