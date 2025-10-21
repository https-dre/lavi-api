import { customer } from "@/database/tables";
import { BadResponse } from "@/http/error-handler";
import { logger } from "@/logger";
import { LaundryBannerModel } from "@/shared/models";
import { S3Provider } from "@/shared/providers/S3Provider";
import { ICustomerRepository, ILaundryBannerRepository, ILaundryRepository, IMemberRepository } from "@/shared/repositories";
import { randomUUID } from "crypto";
import { url } from "inspector";

type MediaService_Repositories = {
  memberRepository: IMemberRepository,
  customerRepository: ICustomerRepository,
  laundryRepository: ILaundryRepository,
  laundryBanner: ILaundryBannerRepository
}

export class MediaService {
  private memberRepository: IMemberRepository
  private customerRepository: ICustomerRepository
  private laundryRepository: ILaundryRepository
  private laundryBannerRepo: ILaundryBannerRepository

  constructor(private objectStorage: S3Provider, repositories: MediaService_Repositories) {
    this.memberRepository = repositories.memberRepository,
      this.customerRepository = repositories.customerRepository,
      this.laundryRepository = repositories.laundryRepository,
      this.laundryBannerRepo = repositories.laundryBanner
  }

  public async uploadFile(arrBuffer: ArrayBuffer, fileType: string) {
    const fileId = randomUUID();
    const fileBuffer = Buffer.from(arrBuffer);
    await this.objectStorage.putObject({
      bucket: Bun.env.BUCKET_NAME!,
      content: fileBuffer,
      contentType: fileType,
      key: fileId
    })

    const fileUploaded = await this.objectStorage.getObject(fileId);
    if (!fileUploaded) {
      throw new BadResponse({
        message: "Erro no upload do arquivo",
        err: "Arquivo não encontrado no S3",
      }, 500)
    }

    return fileUploaded;
  }

  public async deleteFileByUrl(url: string) {
    if (!url.startsWith("https") || !url.includes(".amazonaws.com")) {
      logger.warn("[MediaService] param is not a valid S3 url")
      return
    }
    const split = url.split(".amazonaws.com/");
    if (split.length == 2) {
      const file = await this.objectStorage.getObject(split[1]);
      if (file) {
        await this.objectStorage.deleteObject(file.key);
      }
    }
  }

  public async uploadMemberProfileImage(memberId: string, arrBuffer: ArrayBuffer, fileType: string) {
    const member = await this.memberRepository.findById(memberId);
    if (!member)
      throw new BadResponse("Membro não encontrado.", 404);

    if (member.profile_url) {
      await this.deleteFileByUrl(member.profile_url)
    }

    const fileUploaded = await this.uploadFile(arrBuffer, fileType)

    await this.memberRepository.updateFields(memberId, { profile_url: fileUploaded.url })
  }

  async uploadCustomerProfileImage(
    customerId: string,
    arrayBuffer: ArrayBuffer,
    fileType: string,
  ) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new BadResponse("Conta não encontrada", 404);
    }

    if (customer.profile_url) {
      await this.deleteFileByUrl(customer.profile_url)
    }

    const fileUploaded = await this.uploadFile(arrayBuffer, fileType);
    await this.customerRepository.update({ profile_url: fileUploaded.url }, customerId);
  }

  async uploadLaundryProfileImage(
    laundryId: string,
    arrayBuffer: ArrayBuffer,
    fileType: string,
  ) {
    const laundry = await this.laundryRepository.findById(laundryId);
    if (!laundry) {
      throw new BadResponse("Lavanderia não encontrada", 404);
    }

    if (laundry.profile_url) {
      await this.deleteFileByUrl(laundry.profile_url)
    }

    const fileUploaded = await this.uploadFile(arrayBuffer, fileType);
    await this.customerRepository.update({ profile_url: fileUploaded.url }, laundryId);
  }

  public async uploadLaundryBanner(laundryId: string,
    arrBuffer: ArrayBuffer, fileType: string): Promise<LaundryBannerModel> {
    const laundry = await this.laundryRepository.findById(laundryId);
    if (!laundry)
      throw new BadResponse("Lavanderia não encontrada", 404);

    const fileUploaded = await this.uploadFile(arrBuffer, fileType);
    const bannerUploaded = await this.laundryBannerRepo.save({
      laundryId,
      resource: fileUploaded.url,
      resource_key: fileUploaded.key,
    }) as Required<LaundryBannerModel>;
    return bannerUploaded;
  }
}