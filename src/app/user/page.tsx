'use client';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import InfoForm from './components/InfoForm';
import Notice from './components/Notice';
import {useAuth} from '@/hooks/useAuth';
import {Position} from '@/types';

const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export default function Student() {
    useAuth('user');
    const [currentPosition, setCurrentPosition] = useState<Position>([116.308303, 39.988792]);

    return (
        <div>
            <Header title="违停情况学生反馈提交页面" />
            <MapContainer setCurrentPosition={setCurrentPosition} />
            <InfoForm position={currentPosition} />
            <Notice />
        </div>
    );
}
