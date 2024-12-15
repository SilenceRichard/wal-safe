const crypto = require("crypto");
const { Ed25519Keypair } = require("@mysten/sui/keypairs/ed25519");

// 生成随机 AES 密钥
function generateAesKey() {
  return crypto.randomBytes(32); // 256-bit AES key
}

// 使用 AES 加密数据
function encryptData(data, aesKey) {
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return { encrypted, iv };
}

// 使用 AES 解密数据
function decryptData(encrypted, aesKey, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// 用私钥签名 AES 密钥
async function signAesKey(aesKey, keypair) {
  const signature = await keypair.signPersonalMessage(aesKey);
  return signature;
}

// 验证签名
async function verifySignature(aesKey, signature, publicKey) {
  const isValid = await publicKey.verifyPersonalMessage(aesKey, signature);
  if (!isValid) throw new Error("签名验证失败！");
}

async function main() {
  const fileString = "hello world";
  /**
   * 1. aes
   * 2. upload, walrus -> aes content （aes)
   * 3. download -> aes -> 签名
   * 
   */
  // Step 1: demo 生成 Sui 密钥对
  const keypair = new Ed25519Keypair();
  const publicKey = keypair.getPublicKey();
  const privateKey = keypair.getSecretKey();

  // Step 2: 生成 AES 密钥并加密数据
  const aesKey = generateAesKey();
  const { encrypted, iv } = encryptData(fileString, aesKey);

  // upload

  // Step 3: 用 Sui 私钥签名 AES 密钥
  const { signature } = await signAesKey(aesKey, keypair);
  console.log("加密内容：", encrypted);
  console.log("签名：", signature);

  // Step 4: 验证签名并解密数据
  await verifySignature(aesKey, signature, publicKey);
  const decrypted = decryptData(encrypted, aesKey, iv);
  console.log("解密内容：", decrypted);
}

main().catch(console.error);
