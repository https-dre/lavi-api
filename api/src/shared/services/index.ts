import { CustomerRepository } from "@/customer/customer-repository";
import { CryptoProvider, JwtProvider } from "../providers/crypto-provider";
import { IdentityService } from "./identity-service";
import { OrderRepository } from "@/order/order-repository";
import { OrderService } from "@/order/order-service";
import { LaundryRepository } from "@/laundry/laundry-repository";
import { LaundryService } from "@/laundry/laundry-service";
import { CustomerService } from "@/customer/customer-service";
import { MemberRepository } from "@/member/member-repository";
import { MemberService } from "@/member/member-service";
import { CatalogRepository } from "@/catalog-item/catalog-item.repository";
import { CatalogItemService } from "@/catalog-item/catalog-item.service";
import { S3Provider } from "../providers/S3Provider";
import { MediaService } from "@/media/media-service";
import { LaundryBannerRepository } from "@/laundry/laundry-banner-repository";

const customerRepository = new CustomerRepository();
const orderRepository = new OrderRepository();
const laundryRepository = new LaundryRepository();
const laundryBannerRepository = new LaundryBannerRepository();
const memberRepository = new MemberRepository();
const catalogRepository = new CatalogRepository();

const cryptoProvider = new CryptoProvider();
const jwtProvider = new JwtProvider();

const identityService = new IdentityService(
  customerRepository,
  memberRepository,
);

const objectStorage = new S3Provider(Bun.env.BUCKET_NAME!);

const appServices = {
  identity: new IdentityService(customerRepository, memberRepository),
  customer: new CustomerService(
    customerRepository,
    cryptoProvider,
    jwtProvider,
    identityService,
    objectStorage,
  ),
  order: new OrderService(
    orderRepository,
    customerRepository,
    laundryRepository,
  ),
  laundry: new LaundryService(laundryRepository, memberRepository),
  member: new MemberService(
    memberRepository,
    laundryRepository,
    jwtProvider,
    cryptoProvider,
  ),
  catalogService: new CatalogItemService(catalogRepository, laundryRepository),
  mediaService: new MediaService(objectStorage, {
    memberRepository, customerRepository,
    laundryRepository, laundryBanner: laundryBannerRepository
  })
};

export { appServices };
