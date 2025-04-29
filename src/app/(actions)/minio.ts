"use server";

import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";

const MINIO_BUCKET_NAME = "images";

const s3Client = new S3Client({
  endpoint: "https://minio.slocksert.dev/",
  region: "us-east-1",
  credentials: {
    accessKeyId: "tikservice",
    secretAccessKey: "tikservice_engenharia_software",
  },
  forcePathStyle: true,
});

async function ensureBucketExists() {
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: MINIO_BUCKET_NAME,
      })
    );
  } catch (error) {
    console.log("error:", error);
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: MINIO_BUCKET_NAME,
      })
    );

    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${MINIO_BUCKET_NAME}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: MINIO_BUCKET_NAME,
        Policy: JSON.stringify(policy),
      })
    );
  }
}

interface FileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export async function getImageUploadUrl(
  file: FileData,
  fileType: string,
  messageId: string
) {
  try {
    await ensureBucketExists();

    const fileName = `${messageId}-${file.originalname.replace(/\s+/g, "-")}`;

    const fileContent = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);

    const command = new PutObjectCommand({
      Bucket: MINIO_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: fileType,
      ContentLength: fileContent.length,
    });

    const result = await s3Client.send(command);
    console.log("Image upload successful:", result);

    const imageUrl = `https://minio.slocksert.dev/${MINIO_BUCKET_NAME}/${fileName}`;
    console.log("Generated image URL:", imageUrl);

    return {
      imageUrl: imageUrl,
    };
  } catch (error) {
    console.error("Error uploading image to MinIO:", error);
    throw new Error("Failed to upload image");
  }
}