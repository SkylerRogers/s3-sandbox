// Import the required modules from AWS SDK and Node.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

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

// Define the bucket name and file path
const bucketName = 'skyler-sandbox';
const filePath = path.join(__dirname, 'helloworld.txt');

// Function to create the file
const createFile = async () => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, 'Hello, World!', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Function to upload the file
const uploadFile = async () => {
    try {
        // Create the file
        await createFile();

        // Create a readable stream for the file
        const fileStream = fs.createReadStream(filePath);

        // Define the parameters for the upload
        const uploadParams = {
            Bucket: bucketName,
            Key: 'helloworld.txt', // the name of the file in the bucket
            Body: fileStream,
        };

        // Upload the file
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('Success', data);
    } catch (err) {
        console.error('Error', err);
    } finally {
        // Optionally delete the file after upload
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file', err);
            }
        });
    }
};

// Run the upload function
uploadFile();
