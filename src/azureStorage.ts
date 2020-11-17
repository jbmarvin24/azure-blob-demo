import azure from 'azure-storage';
require('dotenv').config();

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING ?? '';
const ACCOUNT_NAME = 'cvmfinancediag';
const CONTAINER_NAME = 'testing-blob';
const BLOB_NAME = 'Batman Minimalist Wallpaper.jpg';

generateSASAccount();

function generateSasUrl(): void {
  // Generated SAS URL in specific blob/file (read only)
  const blobService = azure.createBlobService();

  const startDate = new Date();
  const expiryDate = new Date(startDate);
  // expiryDate.setMinutes(startDate.getMinutes() + 100);
  // startDate.setMinutes(startDate.getMinutes() - 100);

  expiryDate.setMinutes(startDate.getMinutes() + 1);

  const sharedAccessPolicy: azure.common.SharedAccessPolicy = {
    AccessPolicy: {
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
      Start: startDate,
      Expiry: expiryDate,
    },
  };

  const token = blobService.generateSharedAccessSignature(
    CONTAINER_NAME,
    BLOB_NAME,
    sharedAccessPolicy
  );

  const sasUrl = blobService.getUrl(CONTAINER_NAME, BLOB_NAME, token);

  console.log(sasUrl);
}

async function generateSASAccount() {
  // Generated SAS to have access to Create, Delete and etc.

  const startDate = new Date();
  const expiryDate = new Date(startDate);
  // expiryDate.setMinutes(startDate.getMinutes() + 100);
  // startDate.setMinutes(startDate.getMinutes() - 100);

  expiryDate.setMinutes(startDate.getMinutes() + 5);
  const AccountSasConstants = azure.Constants.AccountSasConstants;

  const sharedAccessPolicy: azure.common.SharedAccessPolicy = {
    AccessPolicy: {
      Services: AccountSasConstants.Services.BLOB,
      ResourceTypes:
        // AccountSasConstants.Resources.SERVICE +
        // AccountSasConstants.Resources.CONTAINER +
        AccountSasConstants.Resources.OBJECT,
      Permissions:
        // AccountSasConstants.Permissions.READ +
        // AccountSasConstants.Permissions.ADD,
        AccountSasConstants.Permissions.CREATE, // for creating blob
      // AccountSasConstants.Permissions.WRITE +
      // AccountSasConstants.Permissions.DELETE +
      // AccountSasConstants.Permissions.LIST,
      Protocols: AccountSasConstants.Protocols.HTTPSONLY,
      Start: startDate,
      Expiry: expiryDate,
    },
  };

  const key = process.env.AZURE_STORAGE_ACCESS_KEY ?? '';
  const sas = azure.generateAccountSharedAccessSignature(ACCOUNT_NAME, key, sharedAccessPolicy);

  console.log('SAS Token:', sas);
}
