'use client';
import Image from 'next/image';
import {redirect} from 'next/navigation';
import React, {useState} from 'react';

const LoginForm: React.FC = () => {
    const [ID, setID] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ID === 'student') {
            redirect('/student');
        } else if (ID === 'guard') {
            redirect('/guard');
        } else if (ID === 'admin') {
            redirect('/admin');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">
                用户登录
            </h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                    账号
                </label>
                <input
                    type="text"
                    id="ID"
                    value={ID}
                    onChange={(e) => setID(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700">
                    密码
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    // required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-customRed text-white py-2 rounded"
            >
                登录
            </button>
        </form>
    );
};

const Landing: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm flex flex-col gap-10">
                <div>
                    <Image
                        src="/images/pkulogo_red.svg"
                        alt="logo"
                        className="mx-auto mt-20"
                        width={100}
                        height={100}
                    />
                </div>
                <LoginForm />
            </div>
        </div>
    );
};

export default Landing;
