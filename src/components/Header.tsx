import Image from 'next/image';
import React from 'react';

interface Props {
    title: string
}
const Header: React.FC<Props> = ({ title }) => {
    return (
        <div className='h-10 bg-customRed text-white flex justify-around items-center p-4 '>
            <div>
                {title}
            </div>
            <div>
                <Image src='/images/pkulogo_white.svg' alt='logo' width={35} height={35} />
            </div>
        </div>
    );
};

export default Header;