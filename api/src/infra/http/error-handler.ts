import { logger } from "../logger";

export class BadResponse extends Error {
  public response: string | object;
  public status: number;

  constructor(response: string | object, status: number = 400) {
    const message = typeof response === "string" ? response : "Error";

    super(message);

    this.name = "BadResponse";
    this.response =
      typeof response === "string" ? { details: response } : response;
    this.status = status;
  }
}
