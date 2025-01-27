'use client';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {ReportData} from '@/types';
import {formatDisplayDateTime} from '@/utils';
import {ColumnDef} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import EidtableRow from './EidtableRow';

export const columns: ColumnDef<ReportData>[] = [
    {
        accessorKey: 'reportId',
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()
                    || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'vehicleType',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    车辆类型
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'plateNumber',
        header: '车牌号',
    },
    {
        accessorKey: 'date',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    日期
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
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
