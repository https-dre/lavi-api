import { LaundryDTO } from "../shared/dto";
import { BadResponse } from "@/http/error-handler";
import { remove_sensitive_fields } from "../shared/functions/remove-sensitive-fields";
import { LaundryModel } from "../shared/models";
import {
  CryptoProvider,
  JwtProvider,
} from "../shared/providers/crypto-provider";
import { ILaundryRepository, IMemberRepository } from "../shared/repositories";
import { LaundryType } from "../shared/dto/typebox";
import _ from "lodash";
import { generateSlug } from "../shared/functions/generate-slug";

const sensitive_fields = [
  "account_number",
  "cnpj",
  "account_type",
  "bank_code",
  "bank_number",
  "bank_agency",
];

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
    const cnpj_index = this.crypto.sha256(laundry.cnpj!);
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

    return remove_sensitive_fields(this.decryptLaundry(laundryFound));
  }

  async findByMemberId(memberId: string): Promise<LaundryDTO[]> {
    if (!(await this.memberRepository.findById(memberId)))
      throw new BadResponse("Membro de lavanderia não encontrado", 404);

    const laundries = await this.repository.findByMemberId(memberId);
    return laundries.map((l) => this.decryptLaundry(l));
  }

  decryptLaundry(l: LaundryModel): LaundryDTO {
    const decrypted_laundry = this.crypto.decryptEntity(l, sensitive_fields);
    return this.adaptModel(decrypted_laundry);
  }

  private async checkJwt(token: string) {
    const payload = this.jwt.verifyToken(token) as {
      email: string;
      role: string;
    };
    return payload;
  }

  async verifyTokenAndValidateOwner(header: string) {
    if (!header.startsWith("Bearer "))
      throw new BadResponse({
        details: "Sessão inválida",
        err: "Invalid 'Authorization' header",
      });
    const token = header.split(" ")[1];
    const jwtPayload = await this.checkJwt(token);
    return {
      token,
      jwtPayload,
    };
  }

  async updateLaundryFields(
    laundryId: string,
    updatedFields: Record<string, any>,
  ) {
    const laundryWithId = await this.repository.findById(laundryId);
    if (!laundryId) throw new BadResponse("Lavanderia não encontrado", 404);
    const decryptedLaundry = this.crypto.decryptEntity(
      laundryWithId,
      sensitive_fields,
    );
    const updated_laundry = { ...decryptedLaundry, ...updatedFields } as Record<
      string,
      any
    >;
    const encrypted_fields = {} as Record<string, any>;
    for (const field of sensitive_fields) {
      if (updated_laundry[field]) {
        encrypted_fields[field] = this.crypto.encrypt(updated_laundry[field]);
      }
    }
    let cnpj_blind_index = updated_laundry.cnpj_blind_index;
    if (updatedFields.cnpj) {
      cnpj_blind_index = this.crypto.hmac(updatedFields.cnpj);
    }
    const updatedRecord = {
      ...updated_laundry,
      ...encrypted_fields,
      cnpj_blind_index,
    };
    await this.repository.update(laundryId, updatedRecord);
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
}
