import {UpdateReport} from '@/api/reports';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Textarea} from '@/components/ui/textarea';
import {useBoolean} from '@/hooks';
import {useGuardStore} from '@/stores';
import {ReportData} from '@/types';
import {formatDisplayDateTime} from '@/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

interface EidtableRowProps {
    data: ReportData;
}

const formSchema = z.object({
    confirmed: z.boolean(),
    addRemark: z.string().optional(),
});

export default function EidtableRow({data}: EidtableRowProps) {
    const {value: isOpen, setFalse: closeDialog, toggle} = useBoolean(false);
    const {updateData} = useGuardStore();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            confirmed: data.confirmed,
            addRemark: '',
        },
    });

    const onSubmit = async ({confirmed, addRemark}: z.infer<typeof formSchema>) => {
        try {
            const submitData: UpdateReport = {
                reportId: data.reportId,
                ...(addRemark && {guardRemark: [addRemark.trim()]}),
                confirmed,
            };

            await updateData(submitData);
            form.reset({
                confirmed,
                addRemark: '',
            });
            closeDialog();
        }
        catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogTrigger>编辑</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑报告数据</DialogTitle>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vehicleType" className="text-right">
                                车辆类型
                            </Label>
                            <Input
                                id="vehicleType"
                                name="vehicleType"
                                value={data.vehicleType}
                                disabled
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plateNumber" className="text-right">
                                车牌号
                            </Label>
                            <Input
                                id="plateNumber"
                                name="plateNumber"
                                value={data.plateNumber}
                                disabled
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                日期
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                value={formatDisplayDateTime(data.date)}
                                disabled
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="remark" className="text-right">
                                学生备注
                            </Label>
                            <Input
                                id="remark"
                                name="remark"
                                value={data.remark}
                                disabled
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="guardRemark" className="text-right">
                                保安员备注
                            </Label>
                            <Textarea
                                id="guardRemark"
                                name="guardRemark"
                                value={data.guardRemark.filter(remark => remark.trim() !== '').join('\n')}
                                disabled
                                className="col-span-3"
                            />
                        </div>
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="addRemark"
                                render={({field}) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">增加备注</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmed"
                                render={({field}) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">被核实</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value ? 'yes' : 'no'}
                                                onValueChange={value => field.onChange(value === 'yes')}
                                                className="flex col-span-3"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="yes" id="yes" />
                                                    <Label htmlFor="yes">是</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="no" id="no" />
                                                    <Label htmlFor="no">否</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Form>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>保存修改</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
