"use client";

import React from "react";

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

interface CatalogRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Item | null;
    apiBase: string;
}

export default function CatalogRequestModal({ isOpen, onClose, product, apiBase }: CatalogRequestModalProps) {
    const [formData, setFormData] = React.useState({ name: '', email: '', phone: '', product: product?.title || '' });
    const [formError, setFormError] = React.useState('');
    const [formSuccess, setFormSuccess] = React.useState('');

    React.useEffect(() => {
        setFormData({ name: '', email: '', phone: '', product: product?.title || '' });
        setFormError('');
        setFormSuccess('');
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        try {
            const res = await fetch(`${apiBase}/catalog-requests/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormSuccess('Request submitted successfully!');
                setFormData({ name: '', email: '', phone: '', product: '' });
                // Download the PDF
                if (product && product.catalogs) {
                    try {
                        const pdfRes = await fetch(product.catalogs);
                        const blob = await pdfRes.blob();
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${product.title}_catalog.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    } catch (downloadError) {
                        console.error('PDF download failed:', downloadError);
                    }
                }
                setTimeout(() => onClose(), 2000);
            } else {
                setFormError('Failed to submit request.');
            }
        } catch (error) {
            console.error('Form submit error:', error);
            setFormError('Error submitting request.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Request Catalog</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <input
                            type="text"
                            value={formData.product}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>
                    {formError && <p className="text-red-500 mb-4">{formError}</p>}
                    {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}