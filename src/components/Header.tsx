import Image from 'next/image';
import React from 'react';
import LogoutButton from './LogoutButton';

interface Props {
    title: string;
}
const Header: React.FC<Props> = ({title}) => {
    return (
        <div className="flex items-center justify-around h-10 p-4 text-white md:h-20 bg-customRed ">
            <div className="text-xl md:text-3xl">
                {title}
            </div>
            <div>
                <Image
                    src="/images/pkulogo_white.svg"
                    alt="logo"
                    width={36}
                    height={36}
                    className="w-9 h-9 md:w-12 md:h-12"
                />
            </div>
            <div>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Header;
