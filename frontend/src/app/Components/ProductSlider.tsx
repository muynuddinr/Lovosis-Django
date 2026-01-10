"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
    id: number;
    title: string;
    slug: string;
    image?: string;
    parent_category?: { slug: string } | null;
    category?: { slug: string } | null;
    sub_category?: { slug: string } | null;
};

const API_BASE = "http://127.0.0.1:8000/api";

export default function ProductSlider() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/products/`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data: Product[] = await res.json();

                // Assume the API includes parent_category_slug, category_slug, sub_category_slug
                // If not, you may need to adjust the serializer

                // For rotation every 24 hours
                const now = new Date();
                const day = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
                const startIndex = (day * 8) % Math.max(data.length - 7, 1);
                const selectedProducts = data.slice(startIndex, startIndex + 8);

                setProducts(selectedProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error fetching products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const buildHref = (product: Product) => {
        const slugs = [
            product.parent_category?.slug,
            product.category?.slug,
            product.sub_category?.slug,
            product.slug
        ].filter(Boolean);
        return `/products/${slugs.join('/')}`;
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    if (loading) return <div className="text-center py-8">Loading products...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (products.length === 0) return <div className="text-center py-8">No products available</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
            <div className="relative">
                <div className="flex overflow-hidden">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-1/4 px-2 transition-transform duration-300"
                            style={{
                                transform: `translateX(-${currentIndex * 25}%)`,
                            }}
                        >
                            <Link href={buildHref(product)} className="block">
                                <div className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-xl transition p-4">
                                    {product.image && (
                                        <div className="relative h-40 w-full mb-4">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover rounded-xl"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-center">{product.title}</h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                >
                    ‹
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                >
                    ›
                </button>
            </div>
        </div>
    );
}