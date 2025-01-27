'use client';
import {ReportData} from '@/types';
import {formatDisplayDateTime} from '@/utils';
import {ColumnDef} from '@tanstack/react-table';
import EidtableRow from './EidtableRow';

export const columns: ColumnDef<ReportData>[] = [
    {
        accessorKey: 'vehicleType',
        header: '车辆类型',
    },
    {
        accessorKey: 'plateNumber',
        header: '车牌号',
    },
    {
        accessorKey: 'date',
        header: '日期',
        cell: ({row}) => <div>{formatDisplayDateTime(row.getValue('date'))}</div>,
    },
    {
        accessorKey: 'remark',
        header: '学生备注',
    },
    {
        accessorKey: 'guardRemark',
        header: '保安员备注',
        cell: ({row}) => (
            <div>
                {(row.getValue('guardRemark') as string[])
                    .filter(remark => remark.trim() !== '')
                    .map((remark, i) => <div key={i}>{remark.trim()}</div>)}
            </div>
        ),
    },
    {
        accessorKey: 'confirmed',
        header: '被核实',
        cell: ({row}) => <div>{row.getValue('confirmed') ? '是' : '否'}</div>,
    },
    {
        accessorKey: 'processed',
        header: '被处理',
        cell: ({row}) => <div>{row.getValue('processed') ? '是' : '否'}</div>,
    },
    {
        accessorKey: 'edit',
        header: '',
        cell: ({row}) => <EidtableRow data={row.original} />,
    },
];
