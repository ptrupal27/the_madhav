import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { API_URL, getImageUrl } from '../services/api';
import { toast } from 'sonner';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('categories');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const resolveName = (attr) => {
        if (!attr) return '';
        if (typeof attr === 'string') return attr;
        if (typeof attr === 'object' && attr !== null) return attr.en || Object.values(attr)[0] || '';
        return '';
    };

    // Form State
    const [formData, setFormData] = useState({
        name: { en: '', hi: '', gu: '' },
        slug: '',
        category_id: '', // for subcategories
        image: null,
        image_url: ''
    });

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/sub-categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSubCategories(data.data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load sub-categories');
        }
    };

    const resetForm = () => {
        setFormData({
            name: { en: '', hi: '', gu: '' },
            slug: '',
            category_id: '',
            image: null,
            image_url: ''
        });
        setEditingItem(null);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: (typeof item.name === 'object' && item.name !== null) ? { ...item.name } : { en: item.name || '', hi: '', gu: '' },
            slug: item.slug || '',
            category_id: item.category_id || '',
            image: null,
            image_url: ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const isSub = activeTab === 'subcategories';

        // Use FormData for potential image uploads and multi-language JSON support
        const form = new FormData();
        form.append('name[en]', formData.name.en);
        form.append('name[hi]', formData.name.hi || '');
        form.append('name[gu]', formData.name.gu || '');
        form.append('slug', formData.slug);

        if (isSub) {
            form.append('category_id', formData.category_id);
        }

        if (formData.image) {
            form.append('image', formData.image);
        } else if (formData.image_url) {
            form.append('image_url', formData.image_url);
        }

        try {
            const baseUrl = `${API_URL}/admin`;
            const endpoint = isSub ? 'sub-categories' : 'categories';
            const url = editingItem
                ? `${baseUrl}/${endpoint}/${editingItem.id}`
                : `${baseUrl}/${endpoint}`;

            // Using POST even for updates as Laravel handles FormData better with POST/Method mapping
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: form
            });

            if (response.ok) {
                setShowModal(false);
                resetForm();
                if (isSub) fetchSubCategories(); else fetchCategories();
                toast.success('Saved successfully!');
            } else {
                const err = await response.json();
                console.error('Save category error:', err);
                toast.error(err.message || 'Error saving');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            toast.error('Error: ' + error.message);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        const token = localStorage.getItem('admin_token');
        const isSub = activeTab === 'subcategories';

        try {
            const baseUrl = `${API_URL}/admin`;
            const endpoint = isSub ? 'sub-categories' : 'categories';
            const response = await fetch(`${baseUrl}/${endpoint}/${item.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                if (isSub) {
                    setSubCategories(subCategories.filter(s => s.id !== item.id));
                } else {
                    setCategories(categories.filter(c => c.id !== item.id));
                }
                toast.success('Deleted successfully');
            } else {
                const err = await response.json();
                console.error('Delete category error:', err);
                toast.error(err.message || 'Could not delete');
            }
        } catch (error) {
            console.error('Error in handleDelete:', error);
            toast.error('Delete Error: ' + error.message);
        }
    };

    return (
        <AdminLayout>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                    <ul className="nav nav-pills card-header-pills bg-light p-1 rounded-pill">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 rounded-pill px-4 ${activeTab === 'categories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('categories')}
                            >
                                Categories
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 rounded-pill px-4 ${activeTab === 'subcategories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('subcategories')}
                            >
                                Sub-Categories
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                        <h5 className="fw-bold mb-0 text-center text-sm-start">
                            {activeTab === 'categories' ? 'Main Categories' : 'Sub-categories List'}
                        </h5>
                        <button className="btn btn-primary px-4 rounded-pill shadow-sm py-2 fw-bold" onClick={() => { resetForm(); setShowModal(true); }}>
                            <i className="fa-solid fa-plus me-2"></i>
                            Add {activeTab === 'categories' ? 'Category' : 'Sub-category'}
                        </button>
                    </div>

                    <div className="table-responsive">
                        {activeTab === 'categories' ? (
                            <table className="table table-hover align-middle border-top">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3 px-4">Icon</th>
                                        <th className="py-3">Name (EN)</th>
                                        <th className="py-3">Name (HI)</th>
                                        <th className="py-3">Name (GU)</th>
                                        <th className="py-3 text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-5"><div className="spinner-border text-success"></div></td></tr>
                                    ) : categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="px-4">
                                                <img src={getImageUrl(cat.image)} className="rounded shadow-sm border p-1" width="40" height="40" alt="" />
                                            </td>
                                            <td className="fw-bold">{resolveName(cat.name)}</td>
                                            <td>{(typeof cat.name === 'object' && cat.name !== null) ? cat.name.hi : '-'}</td>
                                            <td>{(typeof cat.name === 'object' && cat.name !== null) ? cat.name.gu : '-'}</td>
                                            <td className="text-end px-4">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button className="btn btn-sm btn-light border" onClick={() => handleEdit(cat)}><i className="fa-solid fa-pencil text-primary"></i></button>
                                                    <button className="btn btn-sm btn-light border" onClick={() => handleDelete(cat)}><i className="fa-solid fa-trash text-danger"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-hover align-middle border-top">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3 px-4">Sub-Category Name</th>
                                        <th className="py-3">Name (HI)</th>
                                        <th className="py-3">Name (GU)</th>
                                        <th className="py-3">Parent Category</th>
                                        <th className="py-3 text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subCategories.length > 0 ? subCategories.map((sub) => (
                                        <tr key={sub.id}>
                                            <td className="fw-bold px-4">{resolveName(sub.name)}</td>
                                            <td>{(typeof sub.name === 'object' && sub.name !== null) ? sub.name.hi : '-'}</td>
                                            <td>{(typeof sub.name === 'object' && sub.name !== null) ? sub.name.gu : '-'}</td>
                                            <td><span className="badge bg-success bg-opacity-10 text-success">{resolveName(sub.category?.name)}</span></td>
                                            <td className="text-end px-4">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button className="btn btn-sm btn-light border" onClick={() => handleEdit(sub)}><i className="fa-solid fa-pencil text-primary"></i></button>
                                                    <button className="btn btn-sm btn-light border" onClick={() => handleDelete(sub)}><i className="fa-solid fa-trash text-danger"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="text-center py-4">No sub-categories found</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Category/Subcategory Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-bottom p-4">
                                <h5 className="modal-title fw-bold">
                                    {editingItem ? 'Edit' : 'Add'} {activeTab === 'categories' ? 'Category' : 'Sub-category'}
                                </h5>
                                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        {activeTab === 'subcategories' && (
                                            <div className="col-12">
                                                <label className="form-label fw-bold">Parent Category</label>
                                                <select
                                                    className="form-select"
                                                    required
                                                    value={formData.category_id}
                                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                >
                                                    <option value="">Select Parent</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{resolveName(cat.name)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Name (English)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={formData.name.en ?? ''}
                                                onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Name (Hindi / हिंदी)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name.hi ?? ''}
                                                onChange={(e) => setFormData({ ...formData, name: { ...formData.name, hi: e.target.value } })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Name (Gujarati / ગુજરાતી)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name.gu ?? ''}
                                                onChange={(e) => setFormData({ ...formData, name: { ...formData.name, gu: e.target.value } })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Slug</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. fruit-plants"
                                                value={formData.slug ?? ''}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            />
                                        </div>
                                        {activeTab === 'categories' && (
                                            <>
                                                <div className="col-12">
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <hr className="flex-grow-1 m-0" />
                                                        <span className="text-muted small px-2">Upload Image OR Paste URL</span>
                                                        <hr className="flex-grow-1 m-0" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">
                                                        <i className="fa-solid fa-upload me-2 text-primary"></i>Upload Image File
                                                    </label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0], image_url: '' })}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">
                                                        <i className="fa-solid fa-link me-2 text-secondary"></i>Image URL
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="https://example.com/image.jpg"
                                                        value={formData.image_url}
                                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value, image: null })}
                                                        disabled={!!formData.image}
                                                    />
                                                </div>
                                                {(formData.image || formData.image_url || editingItem?.image) && (
                                                    <div className="col-12">
                                                        <div className="mt-2 p-2 border rounded bg-light d-flex align-items-center gap-3">
                                                            <img 
                                                                src={formData.image ? URL.createObjectURL(formData.image) : (formData.image_url || getImageUrl(editingItem?.image))} 
                                                                alt="preview" 
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                                onError={e => { e.target.src = 'https://placehold.co/60x60?text=?'; }}
                                                            />
                                                            <div className="smaller text-muted">
                                                                {formData.image ? (
                                                                    <span>New file: <strong>{formData.image.name}</strong></span>
                                                                ) : formData.image_url ? (
                                                                    <span>Using URL</span>
                                                                ) : (
                                                                    <span>Current image</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-4 fw-bold">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCategories;
