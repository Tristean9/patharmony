'use client';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import InfoForm from './components/InfoForm';
import Notice from './components/Notice';

const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export default function Student() {
    const [currentPosition, setCurrentPosition] = useState<string>('');

    return (
        <div>
            <Header title="违停情况学生反馈提交页面" />
            <MapContainer setCurrentPosition={setCurrentPosition} />
            <InfoForm location={currentPosition} />
            <Notice />
        </div>
    );
}
