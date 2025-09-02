import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'EngageReward Platform',
    description: 'Solana-based social incentive platform for community engagement campaigns',
    keywords: [
        'solana',
        'social media',
        'engagement',
        'rewards',
        'crypto',
        'community',
        'twitter',
        'campaigns',
    ],
    authors: [{ name: 'EngageReward Team' }],
    creator: 'EngageReward Team',
    publisher: 'EngageReward Platform',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_APP_URL,
        title: 'EngageReward Platform',
        description: 'Earn USDC rewards for authentic social media engagement',
        siteName: 'EngageReward Platform',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EngageReward Platform',
        description: 'Earn USDC rewards for authentic social media engagement',
        creator: '@engagereward',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} h-full antialiased`}>
                <div id="root" className="min-h-full">
                    {children}
                </div>
                <Analytics />
            </body>
        </html>
    );
}
