import Elysia from "elysia";

type Dependencies = {
  checkAuth: (token: string) => Promise<any>;
};

export const customerSessionValidator =
  ({ checkAuth }: Dependencies) =>
  (app: Elysia) =>
    app.derive(async ({ request, headers, set }) => {
      console.log("[AUTH PLUGIN] " + request.url);
      const authHeader = headers["Authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        set.status = 401;
        return {
          error: "Token de autenticação não fornecido ou inválido",
          expected: '{ headers: { Authorization: "Bearer ${token}" } }',
        };
      }
      try {
        const token = authHeader.split(" ")[1];
        const customerData = await checkAuth(token);
        return { customerData };
      } catch (error) {
        set.status = 403;
        return {
          error: "Token inválido ou expirado",
        };
      }
    });
