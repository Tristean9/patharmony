'use client'
import {
    Row,
    Button,
    Form,
    Input,
    Select,
    Col,
    Result,
    Typography,
    List,
} from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import axios from "axios";

const InfoForm = () => {
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const onFinish: FormProps["onFinish"] = async (values) => {
        console.log("Submitting:", values);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submit-violation-info`, values);
            const { message } = response.data;
            setSubmitSuccess(true);
            setSubmitMessage(message);

        } catch (error) {
            setSubmitError(true)
            setSubmitMessage(axios.isAxiosError(error) ? error.response?.data?.error : "提交违停信息失败")
        }
    };

    const showSuccess = () => {
        if (submitSuccess) {
            return (
                <Result
                    status="success"
                    title="提交成功"
                    subTitle={submitMessage}
                />
            );
        }
    };

    const showError = () => {
        if (submitError) {
            return (
                <Result
                    status="error"
                    title="提交失败"
                    subTitle={submitMessage}
                />
            );
        }
    };

    const showInfoForm = () => {
        // if (!submitSuccess && !submitError) {
        return (
            <Form
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
                            name="vehicleId"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="违停情况备注"
                    name={"violationRemarks"}
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
        // }
    };

    const showNotice = () => {
        // 注意事项数据
        const notices = [
            "请遵守安全规定。",
            "保持工作区域整洁。",
            "及时报告异常情况。",
            "定期进行设备维护。",
            "遵循公司政策和流程。",
        ];

        // if (!submitSuccess && !submitError) {
        return (
            <div>
                <Typography.Title level={4}>注意事项</Typography.Title>
                <List
                    bordered
                    dataSource={notices}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text>{item}</Typography.Text>
                        </List.Item>
                    )}
                />
            </div>
        );
        // }
    };

    return (
        <div>
            {showInfoForm()}
            {showNotice()}
            {showSuccess()}
            {showError()}
        </div>
    );
};

export default InfoForm;
