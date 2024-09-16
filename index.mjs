import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

const kmsClient = new KMSClient({ region: "us-east-1" });

const generatorKeyId = "Replace with your key id";

const encryptData = async (plainText, context) => {
    try {
        const command = new EncryptCommand({
            KeyId: generatorKeyId,
            Plaintext: Buffer.from(plainText),
            EncryptionContext: context,
        });
        const response = await kmsClient.send(command);
        return response.CiphertextBlob;
    } catch (e) {
        console.error("Error during encryption: ", e);
    }
};

const decryptData = async (encryptedData, context) => {
    try {
        const command = new DecryptCommand({
            CiphertextBlob: encryptedData,
            EncryptionContext: context,
        });
        const response = await kmsClient.send(command);
        return Buffer.from(response.Plaintext).toString();
    } catch (e) {
        console.error("Error during decryption: ", e);
    }
};

async function processEncryptionFlow() {
    const plainText = "My passwords for sensitive data";
    console.log("----------------------Original Text----------------------");
    console.log(plainText);

    const context = {
        stage: "Token",
        purpose: "Testing",
        origin: "us-east-1",
    };

    // Encrypting
    const encryptedData = await encryptData(plainText, context);
    console.log("----------------------Encrypted Data--------------------");
    console.log(encryptedData);

    // Decrypting
    const decryptedData = await decryptData(encryptedData, context);
    console.log("----------------------Decrypted Data----------------------");
    console.log(decryptedData);
}

processEncryptionFlow();