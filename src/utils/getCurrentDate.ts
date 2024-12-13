// 获取当前日期时间（UTC）
export function getCurrentDate() {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
}
