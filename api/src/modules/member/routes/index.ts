import Elysia from "elysia";
import { authenticateMember } from "./authenticate-account";
import { appServices } from "@/generators";
import { createMember } from "./create-member";
import { createOwnerMember } from "./create-owner";
import { createEmployeeMember } from "./create-employee";
import { listMembers } from "./list-members";
import { deleteMember } from "./delete-member";
import { getLaundriesByMember } from "./get-laundries-by-member";
import { validateAuthToken } from "./validate-token";
import { createNotificationForMember } from "./create-notification";

const memberController = new Elysia()
  .use(validateAuthToken(appServices.member))
  .use(authenticateMember(appServices.member))
  .use(createMember(appServices.member))
  .use(createOwnerMember(appServices.member))
  .use(createEmployeeMember(appServices.member))
  .use(listMembers(appServices.member))
  .use(deleteMember(appServices.member))
  .use(getLaundriesByMember(appServices.laundry))
  .use(createNotificationForMember(appServices.notificationService))

export { memberController };
