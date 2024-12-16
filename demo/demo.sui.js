const { encryptFile } = require('./encrypt.sui');
const { decryptFile } = require('./decrypt.sui');

// 模拟接收方钱包对象
const receiverWallet = {
  signMessage: async (message) => {
    // 模拟签名操作
    const privateKey = crypto.createPrivateKey({ key: 'receiver-private-key' });
    const signature = crypto.sign(null, message, privateKey);
    return signature.toString('base64');
  },
};

(async () => {
  // 文件内容
  const fileContent = '这是需要加密的文件内容';

  // 接收方的公钥
  const receiverPublicKey = Buffer.from('receiver-public-key', 'utf8');

  // 加密文件
  console.log('开始加密...');
  const encryptedData = encryptFile(fileContent, receiverPublicKey);
  console.log('加密后的数据:', encryptedData);

  // 解密文件
  console.log('开始解密...');
  const decryptedContent = await decryptFile(encryptedData, receiverWallet);
  console.log('解密后的内容:', decryptedContent);
})();
