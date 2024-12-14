'use client'
import React, { useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';

interface DataType {
    key: React.Key
    reportId: string
    vehicleType: '自行车' | '电动车' | '机动车'
    vehicleId?: string
    violationRemarks?: string;
    location?: string
    handled: boolean
}

const originData: DataType[] = [
    {
        reportId: "1000234",
        vehicleType: "自行车",
        handled: false,
    },
    {
        reportId: "1000235",
        vehicleType: "电动车",
        handled: false,
    },
    {
        reportId: "1000236",
        vehicleType: "机动车",
        vehicleId: "ABC123",
        handled: false,
    },
].map(item => ({
    key: item.reportId,
    ...item
} as DataType))

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'number' | 'text';
    record: DataType;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    console.log(record, index);
    
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditableTable: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<DataType[]>(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: DataType) => record.key === editingKey;

    const edit = (record: Partial<DataType> & { key: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key.toString());
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as DataType;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: '是否被处理',
            dataIndex: 'handled',
            width: '25%',
            editable: true,
        },
        {
            title: 'report id',
            dataIndex: 'reportId',
            width: '15%',
            editable: false,
        },
        {
            title: '车辆类型',
            dataIndex: 'vehicleType',
            width: '40%',
            editable: false,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (index: number, record: DataType) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table<DataType>
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ onChange: cancel }}
            />
        </Form>
    );
};

export default EditableTable;