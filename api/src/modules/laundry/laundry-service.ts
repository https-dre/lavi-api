import { LaundryDTO } from "@/types/dtos";
import { BadResponse } from "@/infra/http/error-handler";
import { LaundryModel } from "@/types/models";
import {
  CryptoProvider,
  JwtProvider,
} from "@/infra/providers/crypto-provider";
import { ILaundryRepository, IMemberRepository } from "@/types/repositories";
import { LaundryType } from "@/types/typebox";
import _ from "lodash";
import { generateSlug } from "@/functions/generate-slug";

const Laundry_SensitiveFields = [
  "account_number",
  "cnpj",
  "account_type",
  "bank_code",
  "bank_number",
  "bank_agency",
];

type LaundryUpdate_Fields = Omit<
  LaundryDTO,
  "id" | "created_at" | "putEmployeeCode"
>;

export class LaundryService {
  private jwt: JwtProvider;
  private crypto: CryptoProvider;
  constructor(
    private repository: ILaundryRepository,
    private memberRepository: IMemberRepository,
  ) {
    this.jwt = new JwtProvider();
    this.crypto = new CryptoProvider();
  }

  async save(
    ownerId: string,
    laundry: Omit<LaundryDTO, "id" | "created_at" | "putEmployeeCode">,
  ) {
    const cnpj_index = this.crypto.hmac(laundry.cnpj!);
    const laundryFounded = await this.repository.findByCNPJ(cnpj_index);
    if (laundryFounded) {
      throw new BadResponse("Este CNPJ já foi registrado.");
    }

    const owner = await this.memberRepository.findById(ownerId);
    if (!owner) {
      throw new BadResponse("Cadastro de dono não encontrado!");
    }

    const encrypted_laundry: Omit<LaundryModel, "id"> = {
      ...laundry,
      cnpj_blind_index: cnpj_index,
      cnpj: this.crypto.encrypt(laundry.cnpj!),
      bank_code: this.crypto.encrypt(laundry.bank_code!),
      bank_agency: this.crypto.encrypt(laundry.bank_agency!),
      account_number: this.crypto.encrypt(laundry.account_number!),
      account_type: this.crypto.encrypt(laundry.account_type!),
      putEmployeeCode: generateSlug(laundry.name),
      created_at: new Date(),
    };

    const saved_laundry = await this.repository.save(encrypted_laundry);
    await this.memberRepository.pushMemberToLaundry(owner.id, saved_laundry.id);
    return saved_laundry.id;
  }

  async deleteWithId(id: string) {
    if (!(await this.repository.findById(id)))
      throw new BadResponse("Lavanderia não encontrada.", 404);

    await this.repository.delete(id);
  }

  async find(key: string) {
    let laundryFound = await this.repository.findById(key);

    if (!laundryFound)
      laundryFound = await this.repository.findByCNPJ(this.crypto.sha256(key));

    if (!laundryFound) throw new BadResponse("Lavanderia não encontrada.", 404);

    return this.decryptLaundry(laundryFound);
  }

  async findByMemberId(memberId: string): Promise<LaundryDTO[]> {
    if (!(await this.memberRepository.findById(memberId)))
      throw new BadResponse("Membro de lavanderia não encontrado", 404);

    const laundries = await this.repository.findByMemberId(memberId);
    return laundries.map((l) => this.decryptLaundry(l));
  }

  decryptLaundry(l: LaundryModel): LaundryDTO {
    const decrypted_laundry = this.crypto.decryptEntity(
      l,
      Laundry_SensitiveFields,
    );
    return this.adaptModel(decrypted_laundry);
  }

  async updateLaundryFields(
    laundryId: string,
    updatedFields: Partial<LaundryUpdate_Fields>,
  ) {
    const laundryExists = await this.repository.findById(laundryId);
    if (!laundryExists) {
      throw new BadResponse("Lavanderia não encontrada", 404);
    }

    const updatePayload: Record<string, any> = {};
    const keys = Object.keys(updatedFields) as Array<
      keyof LaundryUpdate_Fields
    >;
    for (const key of keys) {
      const value = updatedFields[key];

      // 3. Verificar se o campo é sensível
      if (Laundry_SensitiveFields.includes(key)) {
        updatePayload[key] = value ? this.crypto.encrypt(value) : value;

        // Caso especial para o CNPJ
        if (key === "cnpj") {
          updatePayload["cnpj_blind_index"] = value
            ? this.crypto.hmac(value) // Usar o mesmo método do 'save'
            : null;
        }
      } else {
        updatePayload[key] = value;
      }
    }
    if (Object.keys(updatePayload).length === 0) {
      return;
    }
    await this.repository.update(laundryId, updatePayload);
  }

  async searchByName(name?: string) {
    let searchResult: LaundryModel[] = [];
    if (name && name.trim() != "" && name != "{name}") {
      searchResult = await this.repository.searchByName(name);
      return searchResult.map((e) => this.decryptLaundry(e));
    }
    searchResult = await this.repository.listAll();
    return searchResult.map((e) => this.decryptLaundry(e));
  }

  adaptModel(model: LaundryModel): LaundryDTO {
    const dtoKeys = Object.keys(LaundryType.properties) as (keyof LaundryDTO)[];
    const dto = _.pick(model, dtoKeys);
    return dto;
  }

  public async listLaundries(): Promise<LaundryDTO[]> {
    const laundries = await this.repository.listAll();
    return laundries.map((l) => this.decryptLaundry(l))
  }
}
