import { treaty } from "@elysiajs/eden";
import { App } from "@/http/app";
import { describe, it, expect } from "bun:test";

const api = treaty(App);

describe("API connection", () => {
  it("should return 'Hello World!'", async () => {
    const { data } = await api.ping.get();
    expect(data).toBe("Hello World!");
  });
});
