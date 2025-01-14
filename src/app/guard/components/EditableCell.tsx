import {ReportData} from '@/types';
import {Form, Input, InputNumber, Select} from 'antd';

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
    let inputNode;

    if (inputType === 'number') {
        inputNode = <InputNumber />;
    }
    // 如果是 “是否被核实字段”
    else if (dataIndex === 'confirmed') {
        inputNode = (
            <Select
                defaultValue={false}
                options={[{value: false, label: <span>否</span>}, {value: true, label: <span>是</span>}]}
            />
        );
    }
    else {
        inputNode = <Input />;
    }

    return (
        <td {...restProps}>
            {editing
                ? (
                    <Form.Item
                        name={dataIndex}
                        style={{margin: 0}}
                    >
                        {inputNode}
                    </Form.Item>
                )
                : children}
        </td>
    );
};

export default EditableCell;
