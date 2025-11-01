import { CustomerRepository } from "@/modules/customer/customer-repository";
import { CryptoProvider, JwtProvider } from "@/infra/providers/crypto-provider";
import { IdentityService } from "@/generators/identity-service";
import { OrderRepository } from "@/modules/order/order-repository";
import { OrderService } from "@/modules/order/order-service";
import { LaundryRepository } from "@/modules/laundry/laundry-repository";
import { LaundryService } from "@/modules/laundry/laundry-service";
import { CustomerService } from "@/modules/customer/customer-service";
import { MemberRepository } from "@/modules/member/member-repository";
import { MemberService } from "@/modules/member/member-service";
import { CatalogRepository } from "@/modules/catalog-item/catalog-item.repository";
import { CatalogItemService } from "@/modules/catalog-item/catalog-item.service";
import { S3Provider } from "@/infra/providers/S3Provider";
import { MediaService } from "@/media/media-service";
import { LaundryBannerRepository } from "@/modules/laundry/laundry-banner-repository";
import { FeedbackService } from "@/modules/feedback/feedback-service";
import { FeedbackRepository } from "@/modules/feedback/feedback-repository";

const customerRepository = new CustomerRepository();
const orderRepository = new OrderRepository();
const laundryRepository = new LaundryRepository();
const laundryBannerRepository = new LaundryBannerRepository();
const memberRepository = new MemberRepository();
const catalogRepository = new CatalogRepository();
const feedbackRepository = new FeedbackRepository();

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
    laundryRepository, laundryBanner: laundryBannerRepository, feedbackRepository
  }),
  feedbackService: new FeedbackService(feedbackRepository, laundryRepository, customerRepository)
};

export { appServices };
