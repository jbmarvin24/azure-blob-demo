import { BlobServiceClient } from '@azure/storage-blob';
import { v1 as uuidv1 } from 'uuid';
import cripto from 'crypto';
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const ACCOUNT_NAME = 'cvmfinancediag';
const CONTAINER_NAME = 'testing-blob';

async function main() {
  console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here

  // Using Connection String
  // Create the BlobServiceClient object which will be used to create a container client
  // const blobServiceClient = BlobServiceClient.fromConnectionString(
  //   AZURE_STORAGE_CONNECTION_STRING ?? ''
  // );

  // Using SAS
  const sas =
    'sv=2018-03-28&ss=b&srt=o&sp=c&st=2020-11-14T11%3A33%3A18Z&se=2020-11-14T11%3A38%3A18Z&spr=https&sig=ecU2NsNad5blk%2F41m9gEqkfT5I3759eg%2FiF4etpYARk%3D';
  const blobServiceClient = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net/?${sas}`
  );

  // await createContainer(blobServiceClient);
  // await uploadBlob(blobServiceClient);
  await listOfBlobs(blobServiceClient);
  // await downloadBlob(blobServiceClient);
  // await deleteContainer(blobServiceClient);
}

async function deleteContainer(blobServiceClient: BlobServiceClient) {
  const containerClient = blobServiceClient.getContainerClient(
    'quickstart9542abe0-e678-11ea-9079-197b0bd6b3a9'
  );

  console.log('\nDeleting container...');

  // Delete container
  const deleteContainerResponse = await containerClient.delete();
  console.log('Container was deleted successfully. requestId: ', deleteContainerResponse.requestId);
}

async function downloadBlob(blobServiceClient: BlobServiceClient) {
  const containerClient = blobServiceClient.getContainerClient('testcontainer');

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient('CVMFCC-Logo-2018-750x294.png');

  // Get URL of that file -- Batman
  // console.log(blockBlobClient.url);

  // Get blob content from position 0 to the end
  // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  console.log('\nDownloaded blob content...');
  console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));
}

async function listOfBlobs(blobServiceClient: BlobServiceClient) {
  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  console.log('\nListing blobs...');
  // console.log(containerClient);

  // List the blob(s) in the container.
  for await (const blob of containerClient.listBlobsFlat()) {
    console.log('\t', blob.name);
  }
}

async function uploadBlob(blobServiceClient: BlobServiceClient) {
  // Create a unique name for the blob
  const blobName = 'quickstart' + uuidv1() + '.txt';

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log('\nUploading to Azure storage as blob:\n\t', blobName);

  // Upload data to the blob
  const data = 'Hello, World!';
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
  console.log('Blob was uploaded successfully. requestId: ', uploadBlobResponse.requestId);
}

async function createContainer(blobServiceClient: BlobServiceClient) {
  // Create a unique name for the container
  const containerName = 'quickstart' + uuidv1();

  console.log('\nCreating container...');
  console.log('\t', containerName);

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create the container
  const createContainerResponse = await containerClient.create();
  console.log('Container was created successfully. requestId: ', createContainerResponse.requestId);
}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream?: NodeJS.ReadableStream): Promise<string> {
  if (!readableStream) return '';
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    readableStream.on('data', (data) => {
      chunks.push(data.toString());
    });
    readableStream.on('end', () => {
      resolve(chunks.join(''));
    });
    readableStream.on('error', reject);
  });
}

main()
  .then(() => console.log('Done'))
  .catch((ex) => console.log(ex.message));

// Example of actual Web Client Upload
// https://docs.microsoft.com/en-us/azure/storage/blobs/storage-upload-process-images?tabs=javascript

// router.post('/', uploadStrategy, async (req, res) => {
//   const blobName = getBlobName(req.file.originalname);
//   const stream = getStream(req.file.buffer);
//   const containerClient = blobServiceClient.getContainerClient(containerName2);;
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   try {
//     await blockBlobClient.uploadStream(stream,
//       uploadOptions.bufferSize, uploadOptions.maxBuffers,
//       { blobHTTPHeaders: { blobContentType: "image/jpeg" } });
//     res.render('success', { message: 'File uploaded to Azure Blob storage.' });
//   } catch (err) {
//     res.render('error', { message: err.message });
//   }
// });
