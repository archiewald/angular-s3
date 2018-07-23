// TODO: clean up types

import { promisify } from 'util';
import chalk from 'chalk';
// synthetic default imports doesn't work with node scripts
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';

const wait = (delay = 100) => new Promise(resolve => setTimeout(resolve, delay));

dotenv.config({
  path: './.env'
});

const {
    BUCKET: Bucket,
    AWS_ACCESS_KEY: accessKeyId,
    AWS_SECRET_ACCESS_KEY: secretAccessKey,
    AWS_CLOUDFRONT_DISTRIBUTION_ID: DistributionId,
} = process.env;

// Setup AWS S3 upload.
AWS.config.update({
    credentials: { accessKeyId, secretAccessKey }
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket }
});

const cloudfront = new AWS.CloudFront();

const s3ListObjects = promisify(s3.listObjects).bind(s3);
const s3DeleteObjects = promisify(s3.deleteObjects).bind(s3);
const s3PutObject = promisify(s3.putObject).bind(s3);

const cloudFrontCreateInvalidation = promisify(cloudfront.createInvalidation).bind(cloudfront);
const cloudFrontGetInvalidation = promisify(cloudfront.getInvalidation).bind(cloudfront);

async function invalidate(distributionId: string) {
    // TODO: why below doesn't work?
    // const pathsToInvalidate = ['/index.html'];
    const pathsToInvalidate = ['/*'];
    return await cloudFrontCreateInvalidation({
        DistributionId: distributionId,
        InvalidationBatch: {
            CallerReference: String(+new Date()),
            Paths: {
              Quantity: pathsToInvalidate.length,
              Items: pathsToInvalidate,
            }
        }
    });
}

async function checkInvalidation(distributionId, Id) {
  const { Status } = await cloudFrontGetInvalidation({ distributionId, Id });
  return Status;
}

async function cleanBucket() {
    const { Contents } = await s3ListObjects({ Bucket });

    const objectsToDelete = Contents.map(object => object.Key)
        .map(key => ({ Key: key }));

    if (objectsToDelete.length > 0) {
        const { Deleted, Errors } = await s3DeleteObjects({
            Bucket,
            Delete: { Objects: objectsToDelete }
        });

        Deleted.forEach(object => console.log(chalk.red(' - ' + object.Key)));
        Errors.forEach(object => console.log(chalk.red(' * ' + object)));
    }
}

async function uploadFile(filePath) {
    const { key, mimeType } = prepareUploadMeta(filePath);

    const result = await s3PutObject({
        Key: key,
        Body: fs.readFileSync(filePath),
        ACL: 'public-read',
        ContentType: mimeType,
        CacheControl: `max-age=${process.env.AWS_CACHE_CONTROL || 60 * 60 * 24 * 7}`
    });

    console.log(chalk.green(' + ' + key));

    return result;
}

function prepareUploadMeta(filePath) {
    const key = filePath.split('dist/angular-s3/')[1];
    const mimeType = mime.lookup(path.extname(filePath));

    return { key, mimeType };
}

async function recursivelyUpload(directory) {
    const directoryPath = path.resolve(directory);
    const paths = fs.readdirSync(directoryPath);

    return await Promise.all(
        paths.map(fileName => {
            const filePath = path.join(directoryPath, fileName);
            const isDirectory = fs.lstatSync(filePath).isDirectory();

            return isDirectory
                ? recursivelyUpload(directory + '/' + fileName)
                : uploadFile(filePath);
        })
    );
}

async function runDeploy() {
    console.log('[✈    ]', chalk.blue('Starting deploy'));

    console.log('[ ✈   ]', chalk.red('DELETING DEPENDENCIES FROM S3 BUCKET'));
    await cleanBucket();

    console.log('[  ✈  ]', chalk.green('UPLOADING FILES TO S3 BUCKET'));
    await recursivelyUpload('./dist');

    console.log('[   ✈ ]', chalk.magenta('INVALIDATING CLOUDFRONT DISTRIBUTION'));
    await runAndVerifyInvalidation(DistributionId);

    console.log('[    ✈]', chalk.blue('Deploy successful!'));
}

async function runAndVerifyInvalidation(distributionId) {
    const result = await invalidate(distributionId);

    if (result.Invalidation.Status !== 'Completed') {
        process.stdout.write('waiting for cdn cache invalidation to complete...');
        const startTime = new Date();
        let status = result.Invalidation.Status;

        while (status !== 'Completed') {
            await wait(1000);
            process.stdout.write('.');
            status = await checkInvalidation(distributionId, result.Invalidation.Id);
        }
        process.stdout.write(` done (${Math.round((new Date().getTime() - startTime.getTime()) / 1000)}s)\n`);
    }
}

runDeploy().catch(error => console.error(error, error.stack));
