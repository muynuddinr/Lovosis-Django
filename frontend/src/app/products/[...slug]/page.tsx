"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "../../Components/products/Breadcrumb";
import ProductDetail from "../../Components/products/ProductDetail";
import CategoryList from "../../Components/products/CategoryList";
import CatalogRequestModal from "../../Components/products/CatalogRequestModal";

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

const API_BASE = "http://127.0.0.1:8000/api";

export default function ProductsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = useMemo(() => (params.slug as string[]) || [], [params.slug]);

    const [parents, setParents] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Item[]>([]);
    const [subCategories, setSubCategories] = useState<Item[]>([]);
    const [products, setProducts] = useState<Item[]>([]);
    const [productDetail, setProductDetail] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<Array<{ title: string, href: string }>>([]);
    const [showModal, setShowModal] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Item[]>([]);

    // ------------------ Fetch data based on slug ------------------
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setParents([]);
            setCategories([]);
            setSubCategories([]);
            setProducts([]);
            setProductDetail(null);
            setRelatedProducts([]);

            try {
                // ---------------- Parent level ----------------
                if (slug.length === 0) {
                    const res = await fetch(`${API_BASE}/parent-categories/`);
                    setParents(await res.json());
                }
                // ---------------- Parent -> Category or Product ----------------
                else if (slug.length === 1) {
                    const parentSlug = slug[0];

                    // Fetch categories
                    const catRes = await fetch(
                        `${API_BASE}/categories/?parent_category__slug=${parentSlug}`
                    );
                    const catData = await catRes.json();
                    setCategories(catData);

                    // Fetch products at this level
                    const prodRes = await fetch(
                        `${API_BASE}/products/?parent_category__slug=${parentSlug}&category__isnull=true&sub_category__isnull=true`
                    );
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }
                // ---------------- Parent -> Category -> Sub-category or Product ----------------
                else if (slug.length === 2) {
                    const [parentSlug, categorySlug] = slug;

                    // First check if the second slug is a product
                    const productCheckRes = await fetch(
                        `${API_BASE}/products/?slug=${categorySlug}&parent_category__slug=${parentSlug}`
                    );
                    const productCheckData = await productCheckRes.json();

                    if (productCheckData.length > 0) {
                        // It's a product at parent/product level
                        setProductDetail(productCheckData[0]);
                        // Fetch related products
                        const relatedRes = await fetch(`${API_BASE}/products/?parent_category__slug=${parentSlug}&category__isnull=true&sub_category__isnull=true`);
                        const relatedData = await relatedRes.json();
                        setRelatedProducts(relatedData.filter((p: Item) => p.slug !== productCheckData[0].slug));
                    } else {
                        // It's a category, fetch subcategories and products
                        const subRes = await fetch(
                            `${API_BASE}/sub-categories/?category__slug=${categorySlug}`
                        );
                        setSubCategories(await subRes.json());

                        const prodRes = await fetch(
                            `${API_BASE}/products/?parent_category__slug=${parentSlug}&category__slug=${categorySlug}&sub_category__isnull=true`
                        );
                        setProducts(await prodRes.json());
                    }
                }
                // ---------------- Parent -> Category -> Sub-category -> Products OR Parent -> Category -> Product ----------------
                else if (slug.length === 3) {
                    const [parentSlug, categorySlug, subSlug] = slug;

                    // Check if the third slug is a product
                    const productCheckRes = await fetch(
                        `${API_BASE}/products/?slug=${subSlug}&parent_category__slug=${parentSlug}&category__slug=${categorySlug}`
                    );
                    const productCheckData = await productCheckRes.json();

                    if (productCheckData.length > 0) {
                        // It's a product at parent/category/product level
                        setProductDetail(productCheckData[0]);
                        // Fetch related products
                        const relatedRes = await fetch(`${API_BASE}/products/?parent_category__slug=${parentSlug}&category__slug=${categorySlug}&sub_category__isnull=true`);
                        const relatedData = await relatedRes.json();
                        setRelatedProducts(relatedData.filter((p: Item) => p.slug !== productCheckData[0].slug));
                    } else {
                        // It's a subcategory, fetch products
                        const prodRes = await fetch(
                            `${API_BASE}/products/?parent_category__slug=${parentSlug}&category__slug=${categorySlug}&sub_category__slug=${subSlug}`
                        );
                        setProducts(await prodRes.json());
                    }
                }
                // ---------------- Parent -> Category -> Sub-category -> Product ----------------
                else if (slug.length === 4) {
                    const [parentSlug, categorySlug, subSlug, productSlug] = slug;

                    const productRes = await fetch(
                        `${API_BASE}/products/?slug=${productSlug}&parent_category__slug=${parentSlug}&category__slug=${categorySlug}&sub_category__slug=${subSlug}`
                    );
                    const productData = await productRes.json();

                    if (productData.length > 0) {
                        setProductDetail(productData[0]);
                        // Fetch related products
                        const relatedRes = await fetch(`${API_BASE}/products/?parent_category__slug=${parentSlug}&category__slug=${categorySlug}&sub_category__slug=${subSlug}`);
                        const relatedData = await relatedRes.json();
                        setRelatedProducts(relatedData.filter((p: Item) => p.slug !== productData[0].slug));
                    } else {
                        setError("Product not found");
                    }
                }

                // Build breadcrumb
                const bread = [];
                if (slug.length >= 1) {
                    const parentRes = await fetch(`${API_BASE}/parent-categories/?slug=${slug[0]}`);
                    const parentData = await parentRes.json();
                    if (parentData.length > 0) {
                        bread.push({ title: parentData[0].title, href: `/products/${slug[0]}` });
                    }
                }
                if (slug.length >= 2) {
                    const catRes = await fetch(`${API_BASE}/categories/?slug=${slug[1]}&parent_category__slug=${slug[0]}`);
                    const catData = await catRes.json();
                    if (catData.length > 0) {
                        bread.push({ title: catData[0].title, href: `/products/${slug[0]}/${slug[1]}` });
                    }
                }
                if (slug.length >= 3) {
                    const subRes = await fetch(`${API_BASE}/sub-categories/?slug=${slug[2]}&category__slug=${slug[1]}`);
                    const subData = await subRes.json();
                    if (subData.length > 0) {
                        bread.push({ title: subData[0].title, href: `/products/${slug[0]}/${slug[1]}/${slug[2]}` });
                    }
                }
                if (productDetail) {
                    bread.push({ title: productDetail.title, href: `/products/${slug.join('/')}` });
                }
                setBreadcrumb(bread);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err instanceof Error ? err.message : "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    // ------------------ Navigation ------------------
    const handleBack = () => {
        router.back();
    };

    const handleRequestInfo = () => {
        setShowModal(true);
    };

    if (loading) return <div className="text-center py-32">Loading...</div>;
    if (error) return <div className="text-center py-32 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-12">
            <Breadcrumb items={breadcrumb} />

            {productDetail && (
                <ProductDetail
                    product={productDetail}
                    onBack={handleBack}
                    onRequestInfo={handleRequestInfo}
                    relatedProducts={relatedProducts}
                    slug={slug}
                />
            )}

            <CategoryList title="Parent Categories" items={parents} baseSlug={[]} />
            <CategoryList title="Categories" items={categories} baseSlug={[slug[0]]} />
            <CategoryList title="Sub-Categories" items={subCategories} baseSlug={[slug[0], slug[1]]} />
            <CategoryList title="Products" items={products} baseSlug={slug} />

            {!productDetail && parents.length === 0 && categories.length === 0 && subCategories.length === 0 && products.length === 0 && (
                <div className="text-center py-32 text-gray-500">
                    No items found for this path.
                </div>
            )}

            <CatalogRequestModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                product={productDetail}
                apiBase={API_BASE}
            />
        </div>
    );
}