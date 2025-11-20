import { MemberModel } from "@/types/models";

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