import JWT from "jsonwebtoken";
import { CustomerDTO } from "@/types/dtos";
import { BadResponse } from "@/infra/http/error-handler";
import {
  CryptoProvider,
  JwtProvider,
} from "@/infra/providers/crypto-provider";
import { ICustomerRepository } from "@/types/repositories";
import { IdentityService } from "@/generators/identity-service";
import { CustomerModel } from "@/types/models";
import { remove_sensitive_fields } from "@/functions/remove-sensitive-fields";
import { CustomerType } from "@/types/typebox";
import _ from "lodash";
import { TObject } from "@sinclair/typebox";
import { S3Provider } from "@/infra/providers/S3Provider";
import { randomUUID } from "node:crypto";

export class CustomerService {
  constructor(
    readonly repository: ICustomerRepository,
    readonly crypto: CryptoProvider,
    readonly jwt: JwtProvider,
    readonly identityService: IdentityService,
    private objectStorage: S3Provider,
  ) {}

  public validateFields(customer: Omit<CustomerDTO, "id" | "created_at">) {
    if (customer.is_pj && customer.doc.length != 14)
      throw new BadResponse("CNPJ deve conter exatamente 14 caracteres.");
  }

  public async createCustomer(
    customer: Omit<CustomerDTO, "id" | "created_at">,
  ) {
    const email_index = this.crypto.hmac(customer.email);
    if (await this.repository.findByEmail(email_index)) {
      throw new BadResponse("E-mail já cadastrado!");
    }

    if (customer.is_pj && customer.doc.length !== 14) {
      throw new BadResponse("CNPJ deve conter exatamente 14 caracteres.");
    }

    const doc_index = this.crypto.hmac(customer.doc);
    if (await this.identityService.isIdentityTaken(doc_index)) {
      throw new BadResponse("Identidade já existe.");
    }

    const encrypted_customer = {
      ...customer,
      email_blind_index: email_index,
      address: this.crypto.encrypt(customer.address),
      email: this.crypto.encrypt(customer.email),
      doc_blind_index: doc_index,
      doc: this.crypto.encrypt(customer.doc),
      name: this.crypto.encrypt(customer.name!),
      password: this.crypto.hashPassword(customer.password!),
      created_at: new Date(),
    };

    const created = await this.repository.save(encrypted_customer);
    return created.id;
  }

  async deleteWithId(id: string) {
    if (!(await this.repository.findById(id)))
      throw new BadResponse("Cliente não encontrado.", 404);

    await this.repository.delete(id);
  }

  async getCustomerWithId(id: string): Promise<Omit<CustomerDTO, "password">> {
    const customer = await this.repository.findById(id);
    if (!customer) throw new BadResponse("Cliente não encontrado!", 404);

    const decrypted_customer = this.decryptCustomer(customer);
    const { password, ...rest } = decrypted_customer;
    return rest;
  }

  /**
   *
   * @param email Normal e-mail
   * @param password Normal password
   * @returns Jwt token with normal e-mail
   */
  public async authCustomer(email: string, password: string): Promise<string> {
    const customerFounded = await this.repository.findByEmail(
      this.crypto.hmac(email),
    );
    if (
      !customerFounded ||
      !this.crypto.comparePassword(password, customerFounded.password!)
    ) {
      throw new BadResponse("Senha ou e-mail incorretos!", 401);
    }

    return this.jwt.generateToken({ id: customerFounded.id });
  }

  public async updateCustomer(id: string, fields: Record<string, any>) {
    const customerFounded = await this.repository.findById(id);
    if (!customerFounded) {
      throw new BadResponse("Cliente não encontrado.", 404);
    }

    const updatePayload: Record<string, any> = {};
    for (const key of Object.keys(fields)) {
      if (["email", "doc"].includes(key)) {
        updatePayload[`${key}_blind_index`] = this.crypto.hmac(fields[key]);
        updatePayload[key] = this.crypto.encrypt(fields[key]);
        continue;
      }
      if (key == "address") {
        updatePayload[key] = this.crypto.encrypt(fields[key]);
        continue;
      }
      updatePayload[key] = fields[key];
    }

    await this.repository.update(updatePayload, id);
    return id;
  }

  /**
   * Check the token JWT
   * @param token The JWT Token
   * @returns The JWT payload with normal E-mail
   */
  public async checkAuth(token: string) {
    try {
      const payload = this.jwt.verifyToken(token) as { id: string };
      if (!(await this.repository.findById(payload.id)))
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

  public async listAllIds(): Promise<{ id: string }[]> {
    const result = await this.repository.listAllIds();
    return result;
  }

  public decryptCustomer(c: CustomerModel): CustomerDTO {
    const decrypted_customer = this.crypto.decryptEntity(c, [
      "email",
      "doc",
      "name",
      "address",
    ]);
    return this.adaptModel(decrypted_customer);
  }

  adaptModel(c: CustomerModel): CustomerDTO {
    const dtoKeys = Object.keys(
      CustomerType.properties,
    ) as (keyof CustomerDTO)[];
    const dto = _.pick(c, dtoKeys);
    return dto;
  }

  async uploadCustomerProfileImage(
    customerId: string,
    arrayBuffer: ArrayBuffer,
    fileType: string,
  ) {
    const customer = await this.repository.findById(customerId);
    if (!customer) {
      throw new BadResponse("Conta não encontrada", 404);
    }

    if (customer.profile_url) {
      const split = customer.profile_url.split(".amazonaws.com/");
      if (split.length == 2) {
        const file = await this.objectStorage.getObject(split[1]);
        if (file) {
          await this.objectStorage.deleteObject(file.key);
        }
      }
    }

    // começa o upload do arquivo
    const fileId = randomUUID();
    const fileBuffer = Buffer.from(arrayBuffer);
    await this.objectStorage.putObject({
      bucket: Bun.env.BUCKET_NAME!,
      content: fileBuffer,
      contentType: fileType,
      key: fileId,
    });

    const fileUploaded = await this.objectStorage.getObject(fileId);
    if (!fileUploaded) {
      throw new BadResponse(
        {
          message: "Erro no upload do arquivo",
          err: "Arquivo não encontrado no S3",
        },
        500,
      );
    }
    await this.repository.update({ profile_url: fileUploaded.url }, customerId);
  }
}
