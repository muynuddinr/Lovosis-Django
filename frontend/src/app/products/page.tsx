"use client";

import ProductsPage from "./[...slug]/page"; // reuse the same component

export default function ProductsIndexPage() {
    return <ProductsPage />; // no slug passed, acts as slug=[]
}
