import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { BadResponse } from "@/infra/http/error-handler";

export type S3ObjectProps = {
  key: string;
  bucket: string;
  content: Buffer | Uint8Array | Blob | string;
  contentType: string;
};

export type S3Object = {
  key: string;
  url?: string;
  size?: number;
  lastModified?: Date;
};

export class S3Provider {
  private client: S3Client;

  constructor(public bucket: string) {
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async putObject(object: S3ObjectProps) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: object.key,
      Body: object.content,
      ContentType: object.contentType,
    });

    const response = await this.client.send(command);

    const cmd_status = response.$metadata.httpStatusCode;
    if (cmd_status !== 201 && cmd_status !== 200) {
      throw new BadResponse(
        `Failed to upload file to S3, command status: ${cmd_status}`,
        500
      );
    }
  }

  async listObjects(prefix?: string) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    try {
      const response = await this.client.send(command);
      if (response.Contents) {
        const list: S3Object[] = response.Contents.map((object) => {
          return {
            key: object?.Key!,
            url: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`,
            size: object.Size,
            lastModified: object.LastModified,
          };
        });

        return list;
      }
    } catch (err) {
      throw new BadResponse(`failed on ListCommand: ${err}`, 500);
    }
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.client.send(command);
    } catch (err) {
      throw new BadResponse(`failed on DeleteCommand: ${err}`, 500);
    }
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return {
        key: key,
        url: `https://${this.bucket}.s3.${process.env
          .AWS_REGION!}.amazonaws.com/${key}`,
        size: response.ContentLength,
        lastModified: response.LastModified,
      };
    } catch (err: any) {
      if (err.name === "NoSuchKey") {
        return null;
      }
      throw new BadResponse(`failed on GetObjectCommand: ${err}`, 500);
    }
  }
}
