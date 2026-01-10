"use client";

import Link from "next/link";
import Image from "next/image";

type Item = {
    id: number;
    title: string;
    slug: string;
    image?: string;
    image2?: string;
    image3?: string;
    description?: string;
    catalogs?: string;
    key_points?: string;
};

interface ProductCardProps {
    item: Item;
    href: string;
}

export default function ProductCard({ item, href }: ProductCardProps) {
    return (
        <Link href={href} className="block">
            <div className="cursor-pointer group border rounded-xl overflow-hidden shadow hover:shadow-xl transition p-4 bg-white">
                {item.image && (
                    <div className="relative h-40 w-full mb-4">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover rounded-xl"
                            unoptimized
                        />
                    </div>
                )}
                <h2 className="text-lg font-bold group-hover:text-red-600">{item.title}</h2>
            </div>
        </Link>
    );
}