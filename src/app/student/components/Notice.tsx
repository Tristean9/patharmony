import React from 'react';
import { Typography, List } from 'antd';

const Notice: React.FC = () => {

    const notices = [
        '请确保定位精准',
        '请不要填写不实信息',
        '请不要恶意上报信息',
    ];

    return (
        <div className="px-6">
            <div >注意事项</div>
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