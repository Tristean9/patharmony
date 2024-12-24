import Image from 'next/image';
import React from 'react';

interface Props {
    title: string
}
const Header: React.FC<Props> = ({ title }) => {
    return (
        <div className="h-10 md:h-20 bg-customRed text-white flex justify-around items-center p-4 ">
            <div className="text-xl md:text-3xl">
                {title}
            </div>
            <div>
                <Image src="/images/pkulogo_white.svg" alt="logo" width={36} height={36} className="w-9 h-9 md:w-12 md:h-12" />
            </div>
        </div>
    );
};

export default Header;