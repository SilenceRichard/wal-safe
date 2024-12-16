import { toast } from "sonner";
import { decryptData, generateAesKey } from "./encrypt";
import { FileInfo } from "./walrus";

// read base64 file
export async function readBase64File(file: File) {
  // 读取文件为 Base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // e.g., data:image/png;base64,XXXX
        const base64String = reader.result as string;
        const base64Content = base64String.split(",")[1]; // 去掉前缀
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  return await readFileAsBase64(file);
}

export const parseBlobToJson = async (blob: Blob): Promise<any> => {
  try {
    // 使用 Response 读取 Blob 内容
    const text = await blob.text(); // 将 Blob 转换为文本字符串
    const jsonData = JSON.parse(text); // 将文本解析为 JSON 对象
    return jsonData;
  } catch (error) {
    console.error("Blob 解析失败:", error);
    throw new Error("无法解析 Blob 为 JSON");
  }
};


// download file
export const parseBase64AndDownload = (fileInfo: FileInfo, password: string,) => {
  try {
    // 0. 使用密钥解密文件内容
    const {fileName, encrypted, ivBase64 } = fileInfo;
    const aesKey = generateAesKey(password);
    const base64 = decryptData(encrypted, aesKey, ivBase64);
    // 1. 去掉 Base64 前缀（如果存在）
    const base64Content = base64.includes(",") ? base64.split(",")[1] : base64;

    // 2. 将 Base64 解码为二进制数据
    const byteCharacters = atob(base64Content); // 解码 Base64 字符串
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // 3. 创建 Uint8Array（字节数组）
    const byteArray = new Uint8Array(byteNumbers);

    // 4. 根据文件类型生成 Blob
    const blob = new Blob([byteArray]);

    // 5. 创建下载链接并触发下载
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // 6. 清理资源
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log(`文件 "${fileName}" 下载完成`);
  } catch (error) {
    console.error("解析 Base64 并下载失败:", error);
    toast.error("Read Base64 and download file failed");
    throw new Error("无法解析 Base64 并下载文件");
  }
};
