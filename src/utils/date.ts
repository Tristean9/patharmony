import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getNow = () => {
    const now = dayjs().tz('Asia/Shanghai');
    return now;
};

export const formatDisplayDateTime = (dateTime: string) => {
    return dayjs(dateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
};
