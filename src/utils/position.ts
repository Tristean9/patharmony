import {Position} from '@/types';

interface GetLocationResult {
    position: Position | null;
    error: string | null;
}

// 获取当前定位
export const getCurrentPosition = (): Promise<GetLocationResult> => {
    return new Promise(resolve => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        position: [
                            position?.coords?.longitude ?? 116.308303,
                            position?.coords?.latitude ?? 39.988792,
                        ],
                        error: null,
                    });
                },
                error => {
                    resolve({error: error.message, position: null});
                }
            );
        }
        else {
            resolve({
                position: null,
                error: 'Geolocation is not supported by this browser.',
            });
        }
    });
};
