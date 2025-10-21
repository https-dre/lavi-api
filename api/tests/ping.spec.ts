import { describe, it, expect } from "bun:test";
import { api_spec } from "tests";

describe("API connection", () => {
  it("should return 'Hello World!'", async () => {
    const { data } = await api_spec.ping.get();
    expect(data).toBe("Hello World!");
  });
});
