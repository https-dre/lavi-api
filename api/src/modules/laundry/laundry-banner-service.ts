import { randomUUID } from "crypto";
import { BadResponse } from "../../http/error-handler";
import { S3ObjectProps, S3Provider } from "../shared/providers/S3Provider";
import {
  ILaundryBannerRepository,
  ILaundryRepository,
} from "../shared/repositories";
import { LaundryBannerModel } from "../shared/models";

export class LaundryBannerService {
  constructor(
    private bannerRepository: ILaundryBannerRepository,
    private laundryRepository: ILaundryRepository,
    private s3Provider: S3Provider
  ) {}

  public async saveBanner(
    laundry_id: string,
    file: Omit<S3ObjectProps, "key" & "bucket">
  ) {
    // verifica se a lavanderia existe

    if (!(await this.laundryRepository.findById(laundry_id))) {
      throw new BadResponse("Lavanderia não encontrata.", 404);
    }

    // Salva no S3
    const newObject: S3ObjectProps = {
      ...file,
      key: randomUUID(),
      bucket: this.s3Provider.bucket,
    };
    await this.s3Provider.putObject(newObject);
    const savedObject = await this.s3Provider.getObject(newObject.key);

    if (!savedObject) {
      throw new BadResponse("Houve um erro ao salvar a imagem.", 500);
    }

    // salva no postgresql
    const newBanner = {
      resource: savedObject.url,
      resource_key: savedObject.key,
      laundryId: laundry_id,
    };

    const savedBanner = await this.bannerRepository.save(newBanner);
    return savedBanner.resource;
  }

  async listBannersFromLaundry(
    laundryId: string
  ): Promise<LaundryBannerModel[]> {
    if (!(await this.laundryRepository.findById(laundryId))) {
      throw new BadResponse("Lavanderia não encontrata.", 404);
    }

    const banners = await this.bannerRepository.findByLaundryId(laundryId);
    return banners;
  }

  async deleteById(bannerId: string) {
    if (!(await this.bannerRepository.findById(bannerId))) {
      throw new BadResponse("Imagem não encontrata.", 404);
    }

    await this.bannerRepository.delete(bannerId);
  }
}
