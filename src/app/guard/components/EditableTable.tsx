import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Popconfirm, Table, Typography, } from 'antd';
import { ReportData, UpdateParam } from '@/types';
import { useViolationInfo } from '@/hooks';
import { getNow } from '@/utils';
import EditableCell from './EditableCell';

interface EditableTableProps {
    handleSelectedLocation: (selectedData: string[]) => void
}

const EditableTable: React.FC<EditableTableProps> = ({ handleSelectedLocation }) => {
    const [form] = Form.useForm();

    const now = getNow();
    const { reportData, error, loading, updateData } = useViolationInfo({ dateFrom: `${now.format('YYYY-MM-DD')}T00:00:00`, dateEnd: `${now.format('YYYY-MM-DD')}T23:59:59`, processed: false });
    const [data, setData] = useState<ReportData[]>(reportData);

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

    const save = async (report: ReportData) => {
        try {
            const row = await form.validateFields();
            const submitData: UpdateParam = {
                reportId: report.reportId,
                confirmed: row.confirmed,
                ...(row.addRemark && { guardRemark: [row.addRemark.trim()] })
            }

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