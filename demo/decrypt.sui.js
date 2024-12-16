/**
 * 使用接收方钱包签名解密文件
 * @param {Object} encryptedData 加密数据
 * @param {Object} receiverWallet 接收方钱包对象，支持签名 API
 * @returns {string} 解密后的文件内容
 */
async function decryptFile(encryptedData, receiverWallet) {
  const { encryptedContent, authTag, iv, senderPublicKey } = encryptedData;

  // 1. 接收方钱包对挑战消息签名
  const challengeMessage = Buffer.from(senderPublicKey, 'base64');
  const signature = await receiverWallet.signMessage(challengeMessage); // 通过钱包签名

  // 2. 使用签名生成共享密钥
  const sharedSecret = crypto.createHash('sha256')
    .update(signature + senderPublicKey)
    .digest(); // 模拟共享密钥生成

  // 3. 用共享密钥解密对称密钥
  const symmetricKey = sharedSecret.slice(0, 32);

  // 4. 用对称密钥解密文件内容
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    symmetricKey,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  const decryptedContent = Buffer.concat([
    decipher.update(Buffer.from(encryptedContent, 'base64')),
    decipher.final(),
  ]);

  return decryptedContent.toString('utf8');
}

module.exports = {
  decryptFile,
};
