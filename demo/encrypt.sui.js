const crypto = require('crypto');
const { createECDH } = require('crypto');

/**
 * 使用接收方的公钥和签名生成共享密钥，加密文件内容
 * @param {string} fileContent 文件内容
 * @param {Buffer} receiverPublicKey 接收方公钥（Buffer）
 * @returns {Object} 加密后的数据
 */
function encryptFile(fileContent, receiverPublicKey) {
  // 1. 生成随机对称密钥
  const symmetricKey = crypto.randomBytes(32); // 256 位对称密钥
  const iv = crypto.randomBytes(16); // 初始化向量 (IV)

  // 2. 用对称密钥加密文件内容
  const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);
  const encryptedContent = Buffer.concat([cipher.update(fileContent, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // 3. 生成发送方的临时密钥对
  const senderECDH = createECDH('x25519');
  const senderPublicKey = senderECDH.generateKeys(); // 发送方临时公钥

  return {
    encryptedContent: encryptedContent.toString('base64'),
    authTag: authTag.toString('base64'),
    iv: iv.toString('base64'),
    senderPublicKey: senderPublicKey.toString('base64'), // 发送方临时公钥
    symmetricKey: symmetricKey.toString('base64'), // 发送方生成的对称密钥
  };
}

module.exports = {
  encryptFile,
};
