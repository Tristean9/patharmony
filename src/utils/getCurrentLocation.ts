import {MyPosition} from '@/types';

interface GetLocationResult {
    position: MyPosition | null;
    error: string | null;
}

// 获取当前定位
export const getCurrentLocation = (): Promise<GetLocationResult> => {
    return new Promise(resolve => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        position: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
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
