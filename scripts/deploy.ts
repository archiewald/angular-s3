// TODO: clean up types
/* tslint:disable: no-console */

import * as AWS from "aws-sdk";
import chalk from "chalk";
import * as dotenv from "dotenv";
// synthetic default imports doesn't work with node scripts
import * as fs from "fs";
import * as mime from "mime-types";
import * as path from "path";
import {promisify} from "util";

const wait = (delay = 100) =>
    new Promise(resolve => setTimeout(resolve, delay));

const awsCredentials = readConfig();

AWS.config.update({
    credentials: {
        accessKeyId: awsCredentials.accessKeyId,
        secretAccessKey: awsCredentials.secretAccessKey,
    },
});

const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {Bucket: awsCredentials.bucket},
});

const cloudfront = new AWS.CloudFront();

const s3ListObjects = promisify(s3.listObjects).bind(s3);
const s3DeleteObjects = promisify(s3.deleteObjects).bind(s3);
const s3PutObject = promisify(s3.putObject).bind(s3);

const cloudFrontCreateInvalidation = promisify(
    cloudfront.createInvalidation
).bind(cloudfront);

const cloudFrontGetInvalidation = promisify(cloudfront.getInvalidation).bind(
    cloudfront
);

runDeploy().catch(error => console.error(error, error.stack));

async function runDeploy() {
    console.log("[✈    ]", chalk.blue("Starting deploy"));

    console.log("[ ✈   ]", chalk.red("DELETING DEPENDENCIES FROM S3 BUCKET"));
    await cleanBucket(awsCredentials.bucket);

    console.log("[  ✈  ]", chalk.green("UPLOADING FILES TO S3 BUCKET"));
    await recursivelyUpload("./dist");

    console.log(
        "[   ✈ ]",
        chalk.magenta("INVALIDATING CLOUDFRONT DISTRIBUTION")
    );
    await runAndVerifyInvalidation(awsCredentials.distributionId);

    console.log("[    ✈]", chalk.blue("Deploy successful!"));
}

function readConfig() {
    dotenv.config({
        path: ".env",
    });

    const {
        AWS_BUCKET: bucket = "",
        AWS_ACCESS_KEY: accessKeyId = "",
        AWS_SECRET_ACCESS_KEY: secretAccessKey = "",
        AWS_CLOUDFRONT_DISTRIBUTION_ID: distributionId = "",
    } = process.env;

    const credentials = {bucket, accessKeyId, secretAccessKey, distributionId};

    if (
        Object.keys(credentials).every(key => {
            return credentials[key].length > 0;
        })
    ) {
        return credentials;
    }
    throw new Error("Some AWS credential is missing");
}

async function cleanBucket(bucket: string) {
    const {Contents} = await s3ListObjects({Bucket: bucket});

    const objectsToDelete = Contents.map(object => object.Key).map(key => ({
        Key: key,
    }));

    if (objectsToDelete.length > 0) {
        const {Deleted, Errors} = await s3DeleteObjects({
            Bucket: bucket,
            Delete: {Objects: objectsToDelete},
        });

        Deleted.forEach(object => console.log(chalk.red(" - " + object.Key)));
        Errors.forEach(object => console.log(chalk.red(" * " + object)));
    }
}

async function recursivelyUpload(directory: string) {
    const directoryPath = path.resolve(directory);
    const paths = fs.readdirSync(directoryPath);

    return Promise.all(
        paths.map(fileName => {
            const filePath = path.join(directoryPath, fileName);
            const isDirectory = fs.lstatSync(filePath).isDirectory();

            return isDirectory
                ? recursivelyUpload(directory + "/" + fileName)
                : uploadFile(filePath);
        })
    );
}

async function uploadFile(filePath: string) {
    const {key, mimeType} = prepareUploadMeta(filePath);

    // tslint:disable-next-line: no-magic-numbers
    const oneWeekInSec = 60 * 60 * 24 * 7;
    const result = await s3PutObject({
        Key: key,
        Body: fs.readFileSync(filePath),
        ACL: "public-read",
        ContentType: mimeType,
        CacheControl: `max-age=${process.env.AWS_CACHE_CONTROL ||
            oneWeekInSec}`,
    });

    console.log(chalk.green(" + " + key));

    return result;
}

function prepareUploadMeta(filePath: string) {
    const key = filePath.split("dist/angular-s3/")[1];
    const mimeType = mime.lookup(path.extname(filePath));

    return {key, mimeType};
}

async function runAndVerifyInvalidation(distributionId: string) {
    const result = await invalidate(distributionId);
    const oneSec = 1000;

    if (result.Invalidation.Status !== "Completed") {
        process.stdout.write(
            "waiting for cdn cache invalidation to complete..."
        );
        const startTime = new Date();
        let status = result.Invalidation.Status;

        while (status !== "Completed") {
            await wait(oneSec);
            process.stdout.write(".");
            status = await checkInvalidation(
                distributionId,
                result.Invalidation.Id
            );
        }
        process.stdout.write(
            ` done (${Math.round(
                // tslint:disable-next-line: no-magic-numbers
                (new Date().getTime() - startTime.getTime()) / oneSec
            )}s)\n`
        );
    }
}

async function invalidate(distributionId: string) {
    const pathsToInvalidate = ["/*"];
    return cloudFrontCreateInvalidation({
        DistributionId: distributionId,
        InvalidationBatch: {
            CallerReference: String(+new Date()),
            Paths: {
                Quantity: pathsToInvalidate.length,
                Items: pathsToInvalidate,
            },
        },
    });
}

async function checkInvalidation(distributionId: string, id: string) {
    const {Status} = await cloudFrontGetInvalidation({
        DistributionId: distributionId,
        Id: id,
    });
    return Status;
}
