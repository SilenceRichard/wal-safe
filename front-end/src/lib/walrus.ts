import { PUBLISHER, AGGREGATOR } from "@/constants";

export interface FileInfo {
  fileName: string;
  encrypted: string;
  ivBase64: string;
}

export async function uploadToWalrus(file: File, fileInfo: FileInfo) {
  const response = await fetch(`${PUBLISHER}/v1/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(fileInfo),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const jsonData = await response.json(); // 根据返回的数据类型调整解析方式
  return jsonData;
}

export async function downLoadFromWalrus(blobId: string) {
  const response = await fetch(`${AGGREGATOR}/v1/${blobId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const blobData = await response.blob();
  return blobData;
}
