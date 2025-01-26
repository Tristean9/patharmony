'use client';
import {SubmitResponse} from '@/types';
import {Button, Col, Form, Input, Result, Row, Select} from 'antd';
import type {FormProps} from 'antd';
import axios from 'axios';
import {Position} from '@/types';
import {useState} from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InfoFormProps {
    position: Position;
}

export interface StudentSubmitParams {
    vehicleType: string;
    plateNumber: string;
    remark?: string;
    position: Position;
}

export default function InfoForm({position}: InfoFormProps) {
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const [form] = Form.useForm();

    const onFinish: FormProps['onFinish'] = async values => {
        const submitValues: StudentSubmitParams = {...values, position};

        try {
            const response = await axios.post<SubmitResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/post`,
                submitValues
            );
            const {success, message} = response.data;
            setSubmitSuccess(success);
            setSubmitError(!success);
            setSubmitMessage(message);
        }
        catch (error) {
            setSubmitMessage(axios.isAxiosError(error) ? error.response?.data?.error : '提交违停信息失败');
        }
    };

    const handleRetry = () => {
        setSubmitSuccess(false);
        setSubmitError(false);
        setSubmitMessage(null);
        form.resetFields(); // 重置表单
    };

    const handleFixAndResubmit = () => {
        setSubmitError(false); // 移除错误状态，但保留用户填入的信息
    };

    const showSuccess = () => {
        if (submitSuccess) {
            return (
                <>
                    <AlertDialog open={submitSuccess}>
                        <AlertDialogContent className="max-w-[80vw] rounded-sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>提交成功</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {submitMessage}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleRetry}>返回再次提交</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        }
    };

    const showError = () => {
        if (submitError) {
            return (
                <>
                    <AlertDialog open={submitError}>
                        <AlertDialogContent className="max-w-[80vw] rounded-sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>提交失败</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {submitMessage}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleFixAndResubmit}>完善信息，再次提交</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        }
    };

    const showInfoForm = () => {
        if (!submitSuccess && !submitError) {
            return (
                <div className="px-6 mt-3">
                    <Form
                        form={form}
                        name="infoForm"
                        onFinish={onFinish}
                        layout="vertical"
                        style={{maxWidth: 500}}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="车辆类型"
                                    name="vehicleType"
                                    initialValue={'自行车'}
                                >
                                    <Select
                                        options={[
                                            {value: '自行车', label: '自行车'},
                                            {value: '电动车', label: '电动车'},
                                            {value: '机动车', label: '机动车'},
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="车牌号(如有)"
                                    name="plateNumber"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="违停情况备注"
                            name={'remark'}
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button className="bg-customRed" type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            );
        }
    };

    return (
        <div>
            {showInfoForm()}
            {showSuccess()}
            {showError()}
        </div>
    );
}
