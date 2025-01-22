import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Patharmony',
    description: '一个处理违停情况的Web应用',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
            <body>
                {children}
            </body>
        </html>
    );
}
