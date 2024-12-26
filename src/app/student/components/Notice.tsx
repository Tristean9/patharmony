import {List, Typography} from 'antd';
import React from 'react';

const Notice: React.FC = () => {
    const notices = [
        '如果地图没有显示，请确保打开定位服务',
        '请确保定位精准',
        '请不要填写不实信息',
        '请不要恶意上报信息',
    ];

    return (
        <div className="px-6">
            <div>注意事项</div>
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
