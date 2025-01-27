'use client';
import {useContext, useState} from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {SubmitResponse, Position, VehicleType} from '@/types';
import {PositionContext} from '../page';

export interface StudentSubmitParams {
    vehicleType: VehicleType;
    plateNumber?: string;
    remark?: string;
    position: Position;
}

const formSchema = z.object({
    vehicleType: z.nativeEnum(VehicleType), // 使用 z.enum 定义 VehicleType 类型
    plateNumber: z.string().optional(), // plateNumber 可选
    remark: z.string().optional(), // remark 可选
});

export default function InfoForm() {
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const {currentPosition} = useContext(PositionContext);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleType: VehicleType.Bicycle,
            plateNumber: '',
            remark: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        const submitValues: StudentSubmitParams = {...values, position: currentPosition};

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
        form.reset();
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col  gap-2 mx-6 my-4">
                        <div className="flex justify-between gap-6">
                            <FormField
                                control={form.control}
                                name="vehicleType"
                                render={({field}) => (
                                    <FormItem className="min-w-[130px]">
                                        <FormLabel>车辆类型</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="请选择车辆类型" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={VehicleType.Bicycle}>自行车</SelectItem>
                                                    <SelectItem value={VehicleType.EBike}>电动车</SelectItem>
                                                    <SelectItem value={VehicleType.Car}>机动车</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="plateNumber"
                                render={({field}) => (
                                    <FormItem className="min-w-[120px]">
                                        <FormLabel>车牌号(如有)</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="remark"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>违停情况备注</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            // placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">提交</Button>
                    </form>
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
}
