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

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployLambdaZip();
  }

  public async deployLambdaZip() {
    const distRoot = path.join(__dirname, "..", "..");
    const zipFilePath = path.join(
      distRoot,
      "..",
      S3Deployer.LAMBDA_ZIP_FILENAME
    );

    const { orchestrator } = this;
    const { s3, sts } = orchestrator;

    const accountId = (await sts.getCallerIdentity({})).Account!;
    this.orchestrator.setAccountId(accountId);
    const Bucket = S3Deployer.LAMBDA_BUCKET(accountId);

    const headBucket: null | {} = await s3
      .headBucket({ Bucket })
      .catch(() => null);

    if (headBucket) {
      console.info("Bucket exists", Bucket);
    } else {
      await s3.createBucket({ Bucket });
      console.info("Bucket created", Bucket);
    }

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

  public async deployWebUi() {
    throw new Error("not yet implemented");
  }
}
