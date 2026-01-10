"use client";

import Image from "next/image";
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

interface ProductDetailProps {
    product: Item;
    onBack: () => void;
    onRequestInfo: () => void;
    relatedProducts: Item[];
    slug: string[];
}

export default function ProductDetail({ product, onBack, onRequestInfo, relatedProducts, slug }: ProductDetailProps) {
    return (
        <div>
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
                ← Back
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Image Gallery */}
                    <div className="p-8">
                        {(product.image || product.image2 || product.image3) && (
                            <div className="space-y-4">
                                {product.image && (
                                    <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={product.image}
                                            alt={`${product.title} - Image 1`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                {product.image2 && (
                                    <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={product.image2}
                                            alt={`${product.title} - Image 2`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                {product.image3 && (
                                    <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={product.image3}
                                            alt={`${product.title} - Image 3`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="p-8">
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

                        {product.description && (
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                {product.description}
                            </p>
                        )}

                        {product.key_points && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4">Key Points</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {product.key_points.split(',').map((point, index) => (
                                        <li key={index}>{point.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={onRequestInfo}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Request More Info
                        </button>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                item={p}
                                href={`/products/${slug.slice(0, slug.length - 1).concat(p.slug).join('/')}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}