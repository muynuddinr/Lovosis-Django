"use client";

import ProductCard from "./ProductCard";

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

interface CategoryListProps {
    title: string;
    items: Item[];
    baseSlug: string[];
}

export default function CategoryList({ title, items, baseSlug }: CategoryListProps) {
    if (items.length === 0) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        href={`/products/${[...baseSlug, item.slug].join('/')}`}
                    />
                ))}
            </div>
        </div>
    );
}