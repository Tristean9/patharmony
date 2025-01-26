import {useReports} from '@/hooks';
import {ReportData, UpdateParam} from '@/types';
import {formatDisplayDateTime, getNow} from '@/utils';
import type {TableProps} from 'antd';
import {Button, Form, Popconfirm, Table, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import EditableCell from './EditableCell';

export default function EditableTable() {
    const [form] = Form.useForm();

    const now = getNow();
    const {reportData, error, loading, updateData, deleteData} = useReports({
        dateFrom: '2025-01-01T00:00:00+08:00',
        dateEnd: now.format(),
    });
    const [data, setData] = useState<ReportData[]>(reportData);

    useEffect(() => {
        console.log('reportData:', reportData);

        setData(reportData);
    }, [reportData]);

    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: ReportData) => record.reportId === editingKey;

    const edit = (record: Partial<ReportData> & {reportId: string}) => {
        form.setFieldsValue({...record});
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
                ...(row.addRemark && {guardRemark: [row.addRemark.trim()]}),
            };

            await updateData(submitData);
            // 重置表单
            form.resetFields();
            setEditingKey('');
        }
        catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: '反馈信息ID',
            dataIndex: 'reportId',
            width: '10%',
            editable: false,
        },
        {
            title: '反馈日期',
            dataIndex: 'date',
            width: '10%',
            editable: false,
            render: (index: number, record: ReportData) => <span>{formatDisplayDateTime(record.date)}</span>,
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
                    {record
                        .guardRemark
                        .filter(remark => remark.trim() !== '')
                        .map((remark, i) => <div key={i}>{remark.trim()}</div>)}
                </div>
            ),
        },
        {
            title: '被核实',
            dataIndex: 'confirmed',
            width: '5%',
            editable: true,
            render: (index: number, record: ReportData) => <span>{record.confirmed ? '是' : '否'}</span>,
        },
        {
            title: '被处理',
            dataIndex: 'processed',
            width: '5%',
            editable: false,
            render: (index: number, record: ReportData) => <span>{record.processed ? '是' : '否'}</span>,
        },
        {
            title: '编辑',
            dataIndex: 'operation',
            width: '6%',
            render: (index: number, record: ReportData) => {
                const editable = isEditing(record);
                return editable
                    ? (
                        <span>
                            <div className="flex gap-1">
                                <Typography.Link onClick={() => save(record)}>
                                    保存
                                </Typography.Link>
                                <Typography.Link onClick={cancel}>
                                    取消
                                </Typography.Link>
                            </div>
                        </span>
                    )
                    : (
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            编辑
                        </Typography.Link>
                    );
            },
        },
        {
            title: '删除',
            dataIndex: 'delete',
            width: '5%',
            render: (index: number, record: ReportData) => {
                return (
                    <span>
                        <Popconfirm title="确定删除?" onConfirm={() => deleteData(record.reportId)} onCancel={cancel}>
                            <Button danger>删除</Button>
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];

    const mergedColumns: TableProps<ReportData>['columns'] = columns.map(col => {
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

    if (loading) {
        return <div>Loading API key...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className=" mx-auto px-2">
            <Form form={form} component={false}>
                <Table<ReportData>
                    components={{
                        body: {cell: EditableCell},
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowKey="reportId"
                    rowClassName="editable-row"
                    pagination={{onChange: cancel}}
                />
            </Form>
        </div>
    );
}
