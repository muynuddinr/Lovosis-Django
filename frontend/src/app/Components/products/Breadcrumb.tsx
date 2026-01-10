"use client";

import Link from "next/link";

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="mb-6 flex items-center space-x-2 text-sm">
            <Link href="/products" className="text-blue-500 hover:underline">Products</Link>
            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <Link href={item.href} className="text-blue-500 hover:underline">{item.title}</Link>
                </span>
            ))}
        </div>
    );
}