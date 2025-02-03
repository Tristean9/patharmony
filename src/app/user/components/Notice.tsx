export default function Notice() {
    const notices = [
        '如果地图没有显示，请确保打开定位服务',
        '请确保定位精准',
        '请不要填写不实信息',
        '请不要恶意上报信息',
    ];

    return (
        <div className="px-6">
            <div className="text-lg font-semibold mb-4">注意事项</div>
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {notices.map((notice, index) => (
                    <li key={index} className="p-4">
                        <span className="text-gray-700">{notice}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
