import { BadResponse } from "@/infra/http/error-handler";
import { MemberModel } from "@/types/models";
import { CryptoProvider, JwtProvider } from "@/infra/providers/crypto-provider";
import { ILaundryRepository, IMemberRepository } from "@/types/repositories";
import { MemberDTO } from "@/types/dtos";
import { MemberType } from "@/types/typebox";
import _ from "lodash";
import JWT from "jsonwebtoken";

export class MemberService {
  private allowed_roles: string[] = ["owner", "employee"];
  constructor(
    readonly repository: IMemberRepository,
    readonly laundryRepository: ILaundryRepository,
    readonly jwt: JwtProvider,
    readonly crypto: CryptoProvider
  ) {}

  private adaptModel(model: MemberModel): MemberDTO {
    const dtoKeys = Object.keys(MemberType.properties) as (keyof MemberDTO)[];
    return _.pick(model, dtoKeys);
  }

  private decryptMember(model: MemberModel): MemberDTO {
    const decrypted = this.crypto.decryptEntity(model, [
      "name",
      "email",
      "cpf",
    ]);
    return this.adaptModel(decrypted);
  }

  async createMember(data: Omit<MemberDTO, "id" | "created_at">) {
    const email_blind_index = this.crypto.hmac(data.email);
    if (await this.repository.findByEmail(email_blind_index))
      throw new BadResponse("E-mail já cadastrado!");

    const cpf_blind_index = this.crypto.hmac(data.cpf);
    if (await this.repository.findByCpf(cpf_blind_index))
      throw new BadResponse("CPF já cadastrado!");

    const roles = data.roles.filter((role) =>
      this.allowed_roles.includes(role)
    );

    const encrypted: Omit<MemberModel, "id" | "created_at"> = {
      ...data,
      roles,
      cpf_blind_index,
      email_blind_index,
      email: this.crypto.encrypt(data.email),
      cpf: this.crypto.encrypt(data.cpf),
      name: this.crypto.encrypt(data.name),
      password: this.crypto.hashPassword(data.password),
    };

    const created = await this.repository.save(encrypted);
    const decrypted = this.decryptMember(created);
    const { password, ...rest } = decrypted;
    return rest;
  }

  async deleteMember(id: string) {
    if (!(await this.repository.findById(id)))
      throw new BadResponse("Conta não encontrada", 404);

    await this.repository.deleteById(id);
  }

  async getMemberByid(id: string): Promise<MemberDTO> {
    const account = await this.repository.findById(id);
    if (!account) throw new BadResponse("Conta não encontrada", 404);

    return this.decryptMember(account);
  }

  async authenticateMember(email: string, password: string) {
    const account = await this.repository.findByEmail(this.crypto.hmac(email));
    if (!account) throw new BadResponse("E-mail ou Senha incorretos.", 401);

    const passResult = this.crypto.comparePassword(password, account.password);
    if (!passResult) throw new BadResponse("E-mail ou Senha incorretos.", 401);

    return {
      token: this.jwt.generateToken({
        roles: account.roles,
        memberId: account.id,
      }),
      member: this.decryptMember(account),
    };
  }

  async createOwnerMember(
    data: Omit<MemberDTO, "id" | "created_at" | "roles">
  ) {
    const dataToBeSaved = {
      ...data,
      roles: ["owner"],
    };

    const created = await this.createMember(dataToBeSaved);
    return created;
  }

  async createEmployeeMember(
    data: Omit<MemberDTO, "id" | "created_at" | "roles">,
    laundryId: string
  ) {
    if (!(await this.laundryRepository.findById(laundryId)))
      throw new BadResponse("Lavanderia não encontrada!", 404);

    const dataToBeSaved = {
      ...data,
      roles: ["employee"],
    };

    const created = await this.createMember(dataToBeSaved);
    await this.repository.pushMemberToLaundry(created.id, laundryId);
    return created;
  }

  async listAllMembers(): Promise<Omit<MemberDTO, "password">[]> {
    const members = await this.repository.listAll();
    const members_decrypted = members.map((m) => this.decryptMember(m));
    return members_decrypted.map((m) => {
      const { password, ...rest } = m;
      return rest;
    });
  }
  public async checkJwt(token: string) {
    try {
      const payload = this.jwt.verifyToken(token) as {
        memberId: string;
        roles: string[];
      };
      if (!(await this.repository.findById(payload.memberId)))
        throw new BadResponse("Conta não encontrada!", 404);
      return payload;
    } catch (err) {
      if (err instanceof JWT.TokenExpiredError)
        throw new BadResponse("Sessão expirou.");
      if (err instanceof JWT.JsonWebTokenError)
        throw new BadResponse("Sessão inválida.", 401);

      throw err;
    }
  }
}
