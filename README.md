# wal-safe
A  storage website deployed by walrus

# 整体流程

1. 文件上传前解析为字符串
2. 通过sui加密算法加密字符串
3. 将加密字符串传给walrus
4. 通过walrus解密字符串
4. 通过私钥解密字符串
4. 下载文件

## 文件上传转字符串
  在demo示例中展示了文本、图片、通用文件类型的不同转码方式
## 通过sui加密算法加密字符串
  https://sdk.mystenlabs.com/typescript/cryptography/keypairs
  详见`demo/encrypt.js`,使用


