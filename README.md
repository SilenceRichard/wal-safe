# wal-safe
A  storage website deployed by walrus

# 整体流程

1. 文件上传前解析为字符串 ✅
2. 通过加密算法加密字符串 
3. 将加密字符串传给walrus
4. 通过walrus下载字符串
5. 拥有sui私钥的用户可以解密字符串
6. 下载文件

## 文件上传转字符串
  - 转码
  在demo示例中展示了文本、图片、通用文件类型的不同转码方式
  - 使用walrus上传文件
  - 使用walrus下载文件

## 文件的加密和还原
  详见`demo/encrypt.js`,使用
- 使用


