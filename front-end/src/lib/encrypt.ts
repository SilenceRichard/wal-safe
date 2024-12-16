import CryptoJS from "crypto-js";
// password: 用户输入的密码
// 解析用户输入的密码，生成 AES 密钥
export function generateAesKey(password: string): CryptoJS.lib.WordArray {
  return CryptoJS.SHA256(password); // 返回 WordArray 格式的密钥
}

// 使用 AES 加密数据
export function encryptData(data: string, aesKey: CryptoJS.lib.WordArray) {
  // 随机生成 16 字节的 IV（Initialization Vector）
  const iv = CryptoJS.lib.WordArray.random(16);

  // 加密数据
  const encrypted = CryptoJS.AES.encrypt(data, aesKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    encrypted: encrypted.toString(), // 密文（Base64 格式）
    iv: iv.toString(CryptoJS.enc.Base64), // IV（Base64 格式）
  };
}

// 将 iv 转换为 base64 编码（备用函数，直接从 encryptData 中已经生成 Base64）
export function ivToBase64(iv: CryptoJS.lib.WordArray): string {
  return iv.toString(CryptoJS.enc.Base64);
}

// 恢复 iv
export function recoverIv(ivInBase64: string): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Base64.parse(ivInBase64); // 解析 Base64 为 WordArray
}

// 使用 AES 解密数据
export function decryptData(
  encrypted: string,
  aesKey: CryptoJS.lib.WordArray,
  ivBase64: string
): string {
  const decrypted = CryptoJS.AES.decrypt(encrypted, aesKey, {
    iv: CryptoJS.enc.Base64.parse(ivBase64), // 将 Base64 格式的 IV 转为 WordArray
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8); // 解密后返回 UTF-8 字符串
}
