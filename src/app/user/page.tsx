'use client';
import Header from '@/components/Header';
import {useAuth} from '@/hooks/useAuth';
import {Position} from '@/types';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import InfoForm from './components/InfoForm';
import Notice from './components/Notice';
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});
import {UserContext} from '@/contexts';

export default function User() {
    useAuth('user');
    const [currentPosition, setCurrentPosition] = useState<Position>([116.308303, 39.988792]);

    return (
        <UserContext.Provider value={{currentPosition, updateCurrentPosition: setCurrentPosition}}>
            <div>
                <Header title="违停情况学生反馈提交页面" />
                <MapContainer />
                <InfoForm />
                <Notice />
            </div>
        </UserContext.Provider>
    );
}
