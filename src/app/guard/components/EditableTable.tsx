'use client'
import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Typography, } from 'antd';
import { ReportData, UpdateParam } from '@/types';
import { useViolationInfo } from '@/hooks';
import dayjs from 'dayjs';

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
        inputNode = <Select defaultValue={false} options={[{ value: false, label: <span>否</span> }, { value: true, label: <span>是</span> }]} />
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
    handleSelectedLocation: (selectedData: string[]) => void
}

const EditableTable: React.FC<EditableTableProps> = ({ handleSelectedLocation }) => {
    const [form] = Form.useForm();

    const now = dayjs();
    const { reportData, error, loading, updateData } = useViolationInfo({ dateFrom: `${now.format('YYYY-MM-DD')}T00:00:00`, dateEnd: `${now.format('YYYY-MM-DD')}T23:59:59`, processed: false });
    const [data, setData] = useState<ReportData[]>(reportData);

    useEffect(() => {
        console.log('表格组件获取了数据', reportData);

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

    const save = async (report: ReportData) => {
        try {
            const row = await form.validateFields();
            console.log('row: ', row);

            // 重置表单
            // form.resetFields() 
            console.log('report: ', report);
            const submitData: UpdateParam = {
                reportId: report.reportId,
                confirmed: row.confirmed,
                ...(row.addRemark && { guardRemark: [row.addRemark.trim()] })
            }

            console.log('submitData: ', submitData);
            await updateData(submitData);
            // 重置表单
            form.resetFields();
            setEditingKey('');
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
            width: '15%',
            editable: false,
            render: (index: number, record: ReportData) => (
                <div>
                    {record.guardRemark.map((remark, i) => (
                        <div key={i}>{remark}</div>
                    ))}
                </div>
            ),
        },
        {
            title: '被核实',
            dataIndex: 'confirmed',
            width: '5%',
            editable: true,
            render: (index: number, record: ReportData) => <span>{record.confirmed ? '是' : '否'}</span>
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
            width: '5%',
            render: (index: number, record: ReportData) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record)} style={{ marginInlineEnd: 8 }}>
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

    // 动态添加 "增加备注" 列
    if (editingKey) {
        columns.splice(5, 0, {
            title: '增加备注(可选，非必需)',
            dataIndex: 'addRemark',
            width: '15%',
            editable: true,
        });
    }

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
            const selectedLocation = selectedRows.map(item => item.location);
            // 传递给父组件
            handleSelectedLocation(selectedLocation);
        },
        getCheckboxProps: (record: ReportData) => ({
            name: record.reportId,
        }),
        type: 'checkbox'
    };

    if (loading) return <div>Loading API key...</div>;
    if (error) return <div>Error: {error}</div>;

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