import { S3Provider } from "@/infra/providers/S3Provider";
import Elysia, { t } from "elysia";

const s3Api = new Elysia();
const s3Client = new S3Provider(Bun.env.BUCKET_NAME!);

s3Api.get(
  "/files/public/",
  async () => {
    const files = await s3Client.listObjects();
    return { files };
  },
  {
    detail: {
      summary: "List files",
      tags: ["files"],
    },
  },
);

export { s3Api };
