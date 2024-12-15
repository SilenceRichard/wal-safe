import { PUBLISHER } from "@/constants";

export async function uploadToWalrus() {
    const response = await fetch(`${PUBLISHER}/v1/store`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // 根据请求体格式设置
        },
        body: "some other string", // 请求体内容
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json(); // 根据返回的数据类型调整解析方式
    return jsonData
}