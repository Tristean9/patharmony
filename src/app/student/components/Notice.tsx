import React from 'react';
import { Typography, List } from "antd";

const Notice: React.FC = () => {
    // 注意事项数据
    const notices = [
        "请遵守安全规定。",
        "保持工作区域整洁。",
        "及时报告异常情况。",
        "定期进行设备维护。",
        "遵循公司政策和流程。",
    ];

    // if (!submitSuccess && !submitError) {
    return (
        <div>
            <Typography.Title level={4}>注意事项</Typography.Title>
            <List
                bordered
                dataSource={notices}
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text>{item}</Typography.Text>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Notice;