'use client'
import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Typography } from 'antd';
import { ReportData } from '../page';



interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'number' | 'text';
    record: ReportData;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
}) => {

    let inputNode

    if (inputType === 'number') {
        inputNode = <InputNumber />
    }
    // 如果是 “是否被核实字段”
    else if (dataIndex === 'confirmed') {
        inputNode = <Select options={[{ value: false, label: <span>否</span> }, { value: true, label: <span>是</span> }]} />
    }
    else {
        inputNode = <Input />
    }

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

interface EditableTableProps {
    reportData: ReportData[]
    handleSelectedLocation: (selectedData: string[]) => void
}

const EditableTable: React.FC<EditableTableProps> = ({ reportData, handleSelectedLocation }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState<ReportData[]>(reportData);

    // 使用 useEffect 来更新 data
    useEffect(() => {
        setData(reportData);
    }, [reportData]); 


    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: ReportData) => record.reportId === editingKey;

    const edit = (record: Partial<ReportData> & { reportId: string }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.reportId);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (reportId: string) => {
        try {
            const row = (await form.validateFields()) as ReportData;
            const newData = [...data];
            const index = newData.findIndex((item) => reportId === item.reportId);
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
            title: '反馈信息ID',
            dataIndex: 'reportId',
            width: '15%',
            editable: false,
        },
        {
            title: '车辆类型',
            dataIndex: 'vehicleType',
            width: '8%',
            editable: false,
        },
        {
            title: '车牌号',
            dataIndex: 'plateNumber',
            width: '8%',
            editable: false,
        },
        {
            title: '学生备注',
            dataIndex: 'remark',
            width: '19%',
            editable: false,
        },
        {
            title: '保安员备注',
            dataIndex: 'guardRemark',
            width: '19%',
            editable: false,
        },
        {
            title: '位置',
            dataIndex: 'location',
            width: '10%',
            editable: false,
        },
        {
            title: '被核实',
            dataIndex: 'confirmed',
            width: '5%',
            editable: true,
            render: (index: number, record: ReportData) => <span>{index} {record.confirmed ? '是' : '否'}</span>
        },
        {
            title: '被处理',
            dataIndex: 'processed',
            width: '5%',
            editable: false,
            render: (index: number, record: ReportData) => <span>{index} {record.processed ? '是' : '否'}</span>
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: '10%',
            render: (index: number, record: ReportData) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.reportId)} style={{ marginInlineEnd: 8 }}>
                            保存
                        </Typography.Link>
                        <Popconfirm title="确定取消?" onConfirm={cancel}>
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        编辑
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps<ReportData>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ReportData) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const rowSelection: TableProps<ReportData>['rowSelection'] = {
        onChange: (newSelectedData: React.Key[], selectedRows: ReportData[]) => {
            // setSelectedData(selectedRows); // 更新选中状
            console.log('selectedRows: ', selectedRows);
            // 提取被选中的数据的位置
            const selectedLoaction = selectedRows.map(item => item.location);
            
            handleSelectedLocation(selectedLoaction);
            // 传递给父组件

        },
        getCheckboxProps: (record: ReportData) => ({
            name: record.reportId,
        }),
        type: 'checkbox'
    };

    return (
        <div className=' mx-auto px-2'>
            <Form form={form} component={false}>
                <Table<ReportData>
                    components={{
                        body: { cell: EditableCell },
                    }}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowKey="reportId"
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel }}
                />
            </Form>
        </div>
    );
};

export default EditableTable;