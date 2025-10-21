import { describe, expect, it } from "bun:test";
import { api_spec } from "tests";

const createBasicCustomer = async () => {
  const res = await api_spec.customer.post({
    customer: {
      address: "Rua da mãe Joana",
      birth_date: "02-05-2007",
      doc: "111111111",
      email: "filhodajoana@email.com",
      gender: "Masculino",
      is_pj: false,
      name: "Joãozinho",
      password: "senhalegal",
      profile_url: "https://perfil-legal.com",
    },
  });
  return res;
};

describe("customer life cycle", () => {
  it("must return 201", async () => {
    const res = await createBasicCustomer();
    expect(res.status).toBe(201);
  });
});
