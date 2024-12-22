import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getNow = () => {

    const now = dayjs().tz('Asia/Shanghai')
    return now
}
