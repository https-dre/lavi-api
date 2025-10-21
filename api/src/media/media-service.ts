import { customer } from "@/database/tables";
import { BadResponse } from "@/http/error-handler";
import { S3Provider } from "@/shared/providers/S3Provider";
import { ICustomerRepository, ILaundryBannerRepository, ILaundryRepository, IMemberRepository } from "@/shared/repositories";
import { randomUUID } from "crypto";

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

  public async uploadMemberProfileImage(memberId: string, arrBuffer: ArrayBuffer, fileType: string) {
    const member = await this.memberRepository.findById(memberId);
    if (!member)
      throw new BadResponse("Membro não encontrado.", 404);

    if (member.profile_url) {
      const split = member.profile_url.split(".amazonaws.com/")
      if (split.length == 2) {
        const currentImage = await this.objectStorage.getObject(split[1]);
        if (currentImage) {
          await this.objectStorage.deleteObject(currentImage.key)
        }
      }
    }

    const fileUploaded = await this.uploadFile(arrBuffer, fileType)

    await this.memberRepository.updateFields(memberId, { profile_url: fileUploaded.url })
  }
}