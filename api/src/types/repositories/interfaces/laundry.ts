import { LaundryBannerModel, LaundryModel } from "@/types/models";

export interface ILaundryRepository {
  save(data: Omit<LaundryModel, "id">): Promise<LaundryModel>;
  delete(id: string): Promise<void>;
  findByCNPJ(cnpj: string): Promise<LaundryModel>;
  findById(id: string): Promise<LaundryModel>;
  findByEmployeeCode(code: string): Promise<LaundryModel>;
  findByMemberId(id: string): Promise<LaundryModel[]>;
  update(id: string, fields: Record<string, any>): Promise<void>;
  searchByName(name: string): Promise<LaundryModel[]>;
  listAll(): Promise<LaundryModel[]>;
}

export interface ILaundryBannerRepository {
  save(data: Omit<LaundryBannerModel, "id">): Promise<LaundryBannerModel>;
  delete(id: string): Promise<void>;
  findByLaundryId(id: string): Promise<LaundryBannerModel[]>;
  findById(id: string): Promise<LaundryBannerModel>;
}