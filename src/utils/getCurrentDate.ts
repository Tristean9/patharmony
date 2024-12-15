// 获取当前日期时间（UTC）
export function getCurrentDate() {
	const now = new Date();

	const year = now.getFullYear();
	const month = ("0" + (now.getMonth() + 1)).slice(-2);
	const day = ("0" + now.getDate()).slice(-2);
	const hours = ("0" + now.getHours()).slice(-2);
	const minutes = ("0" + now.getMinutes()).slice(-2);
	const seconds = ("0" + now.getSeconds()).slice(-2);

	return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
}
