import path from "path";
import fs from "fs";
import { Orchestrator } from "../orchestration/Orchestrator";
import { HeadObjectOutput } from "@aws-sdk/client-s3";

export class S3Deployer {
  public static LAMBDA_BUCKET = (accountId: string) =>
    "3-strikes-game-bucket-lambda-" + accountId;

  public static readonly LAMBDA_ZIP_FILENAME = "3StrikesGame.zip";

  public static WEB_UI_BUCKET = (accountId: string) =>
    "3-strikes-game-web-ui-" + accountId;

  public static readonly WEB_UI_BUNDLE_FILENAME =
    "3-strikes-game-web-ui-bundle.js";

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployLambdaZip();
    await this.deployWebUi();
  }

  public async deployWebUi() {
    const { orchestrator } = this;
    const Bucket = S3Deployer.WEB_UI_BUCKET(orchestrator.getAccountId());
    await this.ensureBucket(Bucket);
    await this.ensureBucketIsPublic(Bucket);

    const distRoot = path.join(__dirname, "..", "..", "..", "dist-web");
    const webIndexFilePath = path.join(distRoot, "index.html");

    if (!fs.existsSync(webIndexFilePath)) {
      throw new Error("dist-web assets not found. Run make dist-web.");
    }

    const { s3 } = orchestrator;

    const files: string[] = fs.readdirSync(path.dirname(webIndexFilePath));

    for (const file of files) {
      const filePath = path.join(distRoot, file);
      await s3.putObject({
        Bucket,
        Key: file,
        Body: fs.readFileSync(filePath),
        ContentType: {
          html: "text/html",
          js: "text/javascript",
        }[file.split(".").pop() || "html"],
        ContentDisposition: undefined,
      });
      console.info("Uploaded", file);
    }

    console.info("Finished uploading web index and application.");
  }

  public async deployLambdaZip() {
    const distRoot = path.join(__dirname, "..", "..");
    const zipFilePath = path.join(
      distRoot,
      "..",
      S3Deployer.LAMBDA_ZIP_FILENAME
    );

    const { orchestrator } = this;
    const { s3 } = orchestrator;

    const Bucket = S3Deployer.LAMBDA_BUCKET(orchestrator.getAccountId());

    await this.ensureBucket(Bucket);

    const localModifiedDate = fs.statSync(zipFilePath).mtime;
    const remoteModifiedDate = await s3
      .headObject({
        Bucket,
        Key: path.basename(zipFilePath),
      })
      .then((headObject: HeadObjectOutput) => {
        return headObject.LastModified!;
      })
      .catch(() => new Date("3000/1/1"));

    if (localModifiedDate > remoteModifiedDate) {
      console.info("Local ZIP file is newer, uploading");
      const put = await s3.putObject({
        Bucket,
        Key: path.basename(zipFilePath),
        Body: fs.readFileSync(zipFilePath),
      });

      console.info("Uploaded lambda zip", put.$metadata);
    } else {
      console.info(
        "Skipping file upload, remote modified:",
        remoteModifiedDate,
        "Local modified:",
        localModifiedDate
      );
    }
  }

  private async ensureBucket(Bucket: string) {
    const { s3 } = this.orchestrator;
    const headBucket: null | {} = await s3
      .headBucket({ Bucket })
      .catch(() => null);

    if (headBucket) {
      console.info("Bucket exists", Bucket);
    } else {
      await s3.createBucket({ Bucket });
      console.info("Bucket created", Bucket);
    }
  }

  private async ensureBucketIsPublic(Bucket: string) {
    const { orchestrator } = this;
    const { s3 } = orchestrator;
    // await s3.putPublicAccessBlock({
    //   Bucket,
    //   PublicAccessBlockConfiguration: {
    //     BlockPublicPolicy
    //   }
    // })
    await s3.putBucketPolicy({
      Bucket,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AddPerm",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${Bucket}/*`],
          },
        ],
      }),
    });
    console.info("Setting bucket to public", Bucket);
  }
}
