# wal-safe
A  storage website deployed by walrus

# 整体流程

## 上传

1. 文件转码与哈希生成
  
    将用户上传的文件转换为Base64格式，便于后续加密与传输。
    使用SHA-256算法生成文件的哈希值，以确保文件完整性。

2. 文件加密

    生成随机向量（IV），并结合用户提供的明文密码，通过AES加密算法对Base64文件内容进行加密，生成密文和对应的IV。
  
3. 生成签名

    使用用户的私钥对文件的SHA-256哈希值进行数字签名，生成签名（signature）。签名将用于验证文件上传后是否被篡改。
4. 上传数据到Walrus

    将IV、加密后的文件内容（密文）、签名和文件哈希值上传至Walrus存储，保存为Blob数据，生成对应的blobId。用户需妥善保管明文密码以便后续解密。


## 下载

1. 获取存储的文件数据

    根据用户提供的blobId，从Walrus存储中获取文件的IV、加密内容（密文）、签名和文件哈希值。
2. 验证签名

    使用上传时的公钥，对文件的哈希值和签名进行验证，确保文件未被篡改。
    如果签名无效，提示用户文件可能已被修改或公钥不匹配。
3. 文件解密

    使用用户提供的明文密码和下载到的IV，通过AES解密算法将密文解密，恢复原始文件内容（Base64格式）。
4. 文件哈希校验

    对解密得到的文件重新计算SHA-256哈希值，并与下载时的哈希值进行比较。
    如果哈希值一致，则说明解密文件完整无误；否则提示用户可能存在数据损坏。
5. 恢复原始文件

    将Base64格式的解密文件内容还原为用户上传时的原始文件格式（如文本或二进制）。



