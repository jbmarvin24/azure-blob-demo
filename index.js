const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();

async function main() {
  console.log("Azure Blob storage v12 - JavaScript quickstart sample");
  // Quick start code goes here
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;

  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  //await createContainer(blobServiceClient);
  //await uploadBlob(blobServiceClient);
  //await listOfBlobs(blobServiceClient);
  //await downloadBlob(blobServiceClient);
  //await deleteContainer(blobServiceClient);
}

async function deleteContainer(blobServiceClient) {
  const containerClient = blobServiceClient.getContainerClient(
    "quickstart9542abe0-e678-11ea-9079-197b0bd6b3a9"
  );

  console.log("\nDeleting container...");

  // Delete container
  const deleteContainerResponse = await containerClient.delete();
  console.log(
    "Container was deleted successfully. requestId: ",
    deleteContainerResponse.requestId
  );
}

async function downloadBlob(blobServiceClient) {
  const containerClient = blobServiceClient.getContainerClient("testcontainer");

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(
    "CVMFCC-Logo-2018-750x294.png"
  );

  // Get URL of that file -- Batman
  //console.log(blockBlobClient.url);

  // Get blob content from position 0 to the end
  // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  console.log("\nDownloaded blob content...");
  console.log(
    "\t",
    await streamToString(downloadBlockBlobResponse.readableStreamBody)
  );
}

async function listOfBlobs(blobServiceClient) {
  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(
    "quickstartf2684fb0-e686-11ea-ab0a-0d7c39290bab"
  );

  console.log("\nListing blobs...");
  console.log(containerClient);

  // List the blob(s) in the container.
  for await (const blob of containerClient.listBlobsFlat()) {
    console.log("\t", blob.name);
  }
}

async function uploadBlob(blobServiceClient) {
  // Create a unique name for the blob
  const blobName = "quickstart" + uuidv1() + ".txt";

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(
    "quickstartf2684fb0-e686-11ea-ab0a-0d7c39290bab"
  );

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log("\nUploading to Azure storage as blob:\n\t", blobName);

  // Upload data to the blob
  const data = "Hello, World!";
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
  console.log(
    "Blob was uploaded successfully. requestId: ",
    uploadBlobResponse.requestId
  );
}

async function createContainer(blobServiceClient) {
  // Create a unique name for the container
  const containerName = "quickstart" + uuidv1();

  console.log("\nCreating container...");
  console.log("\t", containerName);

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create the container
  const createContainerResponse = await containerClient.create();
  console.log(
    "Container was created successfully. requestId: ",
    createContainerResponse.requestId
  );
}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.log(ex.message));
