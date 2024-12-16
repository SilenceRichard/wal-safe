import { PUBLISHER, AGGREGATOR } from "@/constants";

export async function uploadToWalrus(file: File, base64Content: string) {

  const response = await fetch(`${PUBLISHER}/v1/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({
      fileName: file.name,
      content: base64Content, // 传输纯 Base64 内容
    }),
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
