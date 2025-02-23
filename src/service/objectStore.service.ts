import { Upload } from "@aws-sdk/lib-storage";
import serverConfig from "../configs/server.config";
import { PassThrough } from "stream";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const { accessKey, secretKey, bucket, endPoint } = serverConfig.minio;

const s3 = new S3Client({
    endpoint: endPoint,
    region: "us-east-1",
    forcePathStyle: true,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    }
});

export const uploadToObjectStore = async (fileStream: PassThrough, fileName: any): Promise<string> => {
    try {
        console.log('Uploading file to MinIO:', fileName.filename);
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: bucket,
                Key: fileName.filename,
                Body: fileStream,
                ContentType: "text/csv"
            }
        });
        await upload.done();
        return `${endPoint}/${bucket}/${fileName.filename}`;
    } catch (err) {
        console.log("Error in uploadToObjectStore", err);
        throw err;
    }
};