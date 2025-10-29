import Elysia from "elysia";
import { postCustomer } from "./post-customer";
import { deleteCustomer } from "./delete-customer";
import { getCustomer } from "./get-customer";
import { updateCustomer } from "./update-customer";
import { authenticateCustomer } from "./authenticate-customer";
import { listCustomers } from "./list-customers";
import { appServices } from "../../shared/services";
import { getCustomerOrders } from "./get-customer-orders";
import { customerSessionValidator } from "../session-validator";
import { uploadCustomerProfileImage } from "./upload-profile-image";
import { validateCustomerJWT } from "./validate-token";

const customerController = new Elysia()
  .use(postCustomer(appServices.customer))
  .use(authenticateCustomer(appServices.customer))
  .use(listCustomers(appServices.customer))
  .use(getCustomer(appServices.customer))
  .use(validateCustomerJWT(appServices.customer))
  // routes with authentication
  .use(customerSessionValidator({ checkAuth: appServices.customer.checkAuth }))
  .use(deleteCustomer(appServices.customer))
  .use(updateCustomer(appServices.customer))
  .use(getCustomerOrders(appServices.customer, appServices.order))
  .use(uploadCustomerProfileImage(appServices.mediaService));

export { customerController };
