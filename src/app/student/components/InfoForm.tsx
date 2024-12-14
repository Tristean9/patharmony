'use client'
import {
    Row,
    Button,
    Form,
    Input,
    Select,
    Col,
    Result
} from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import axios from "axios";

interface InfoFormProps {
    location: string
}

export interface StudentSubmitParams {
    vehicleType: string;
    plateNumber: string;
    remark?: string;
    location: string;
}

export interface StudentSubmitResponse {
    success: boolean;
    message: string;
    error?: string;
}


const  InfoForm: React.FC<InfoFormProps> = ({ location }) => {
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const [form] = Form.useForm();

    const onFinish: FormProps["onFinish"] = async (values) => {

        const submitValues: StudentSubmitParams = { ...values, location };
        console.log("Submitting:", submitValues);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/session/report`, submitValues, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { success, message } = response.data as StudentSubmitResponse;
            setSubmitSuccess(success);
            setSubmitError(!success);
            setSubmitMessage(message);
        } catch (error) {
            setSubmitMessage(axios.isAxiosError(error) ? error.response?.data?.error : "提交违停信息失败")
        }
    };

    const handleRetry = () => {
        setSubmitSuccess(false);
        setSubmitError(false);
        setSubmitMessage(null);
        form.resetFields();  // 重置表单
    };

    const handleFixAndResubmit = () => {
        setSubmitError(false);  // 移除错误状态，但保留用户填入的信息
    };

    const showSuccess = () => {
        if (submitSuccess) {
            return (
                <>
                    <Result
                        status="success"
                        title="提交成功"
                        subTitle={submitMessage}
                        extra={<Button type="primary" onClick={handleRetry}> 返回再次提交</Button>}
                    />
                </>
            );
        }
    };

    const showError = () => {
        if (submitError) {
            return (
                <>
                    <Result
                        status="error"
                        title="提交失败"
                        subTitle={submitMessage}
                        extra={<Button type="primary" onClick={handleFixAndResubmit} danger>完善信息，再次提交</Button>}
                    />
                </>
            );
        }
    };

    const showInfoForm = () => {
        if (!submitSuccess && !submitError) {
            return (
                <Form
                    form={form}
                    name="infoForm"
                    onFinish={onFinish}
                    layout="vertical"
                    style={{ maxWidth: 500 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="车辆类型"
                                name="vehicleType"
                                initialValue={"自行车"}
                            >
                                <Select
                                    options={[
                                        { value: "自行车", label: "自行车" },
                                        { value: "电动车", label: "电动车" },
                                        { value: "机动车", label: "机动车" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="车辆识别信息(如车牌号)"
                                name="plateNumber"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="违停情况备注"
                        name={"remark"}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
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
};

export default InfoForm;