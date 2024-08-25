// Import the required modules from AWS SDK and Node.js
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const util = require('util');

// Define your AWS credentials and region
const accessKeyId = process.env.ACCESS_KEY_ID || '';
const secretAccessKey = process.env.ACCESS_SECRET_KEY || '';
const region = 'us-east-1'; // replace with your AWS region

// Create an instance of the S3Client with explicit credentials
const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

// Define the bucket name, file key, and local file path
const bucketName = 'skyler-sandbox';
const fileKey = 'helloworld.txt'; // the name of the file in the bucket
const downloadFilePath = path.join(__dirname, 'downloaded_helloworld.txt');

// Function to download the file from S3
const downloadFile = async () => {
    try {
        // Define the parameters for the get object request
        const getObjectParams = {
            Bucket: bucketName,
            Key: fileKey,
        };

        // Get the object from S3
        const command = new GetObjectCommand(getObjectParams);
        const data = await s3Client.send(command);

        // Create a writable stream to save the file locally
        const fileStream = fs.createWriteStream(downloadFilePath);

        // Pipe the S3 object data to the writable stream
        const pipeline = util.promisify(stream.pipeline);
        await pipeline(data.Body, fileStream);

        console.log('File downloaded successfully to', downloadFilePath);
    } catch (err) {
        console.error('Error', err);
    }
};

// Run the download function
downloadFile();
