import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        site_name: '',
        currency: 'INR',
        tax_percentage: '0',
        maintenance_mode: false,
        site_phone: '',
        site_email: '',
        site_address: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/settings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            if (response.ok) {
                alert('Settings updated successfully');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [activeTab, setActiveTab] = useState('general');

    if (loading) {
        return (
            <AdminLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0 p-0">
                    <ul className="nav nav-tabs nav-justified border-bottom">
                        <li className="nav-item">
                            <button className={`nav-link py-3 fw-bold border-0 ${activeTab === 'general' ? 'active text-primary border-bottom border-primary' : 'text-muted'}`} onClick={() => setActiveTab('general')}>
                                <i className="fa-solid fa-cog me-2"></i> General
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link py-3 fw-bold border-0 ${activeTab === 'payment' ? 'active text-primary border-bottom border-primary' : 'text-muted'}`} onClick={() => setActiveTab('payment')}>
                                <i className="fa-solid fa-credit-card me-2"></i> Payment
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link py-3 fw-bold border-0 ${activeTab === 'delivery' ? 'active text-primary border-bottom border-primary' : 'text-muted'}`} onClick={() => setActiveTab('delivery')}>
                                <i className="fa-solid fa-truck me-2"></i> Delivery
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-3 p-md-4">
                    {activeTab === 'general' && (
                        <div className="animate__animated animate__fadeIn">
                            <h5 className="fw-bold mb-4">General Settings</h5>
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">Site Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={settings.site_name ?? ''}
                                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">Currency Symbol</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={settings.currency ?? ''}
                                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">GST/Tax (%)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={settings.tax_percentage ?? ''}
                                            onChange={(e) => setSettings({ ...settings, tax_percentage: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">Site Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={settings.site_phone ?? ''}
                                            onChange={(e) => setSettings({ ...settings, site_phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">Site Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={settings.site_email ?? ''}
                                            onChange={(e) => setSettings({ ...settings, site_email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Site Address</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={settings.site_address ?? ''}
                                        onChange={(e) => setSettings({ ...settings, site_address: e.target.value })}
                                    ></textarea>
                                </div>
                                <hr className="my-4" />
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="fw-bold mb-1">Maintenance Mode</h6>
                                            <p className="text-muted smaller mb-0">When enabled, front-end will be locked.</p>
                                        </div>
                                        <div className="form-check form-switch fs-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.maintenance_mode === '1' || settings.maintenance_mode === true}
                                                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked ? '1' : '0' })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary px-5 fw-bold">Save All Changes</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="animate__animated animate__fadeIn">
                            <div className="d-flex align-items-center mb-4">
                                <img src="https://www.cashfree.com/favicon.ico" width="32" className="me-2" alt="Cashfree" />
                                <h5 className="fw-bold mb-0">Cashfree Integration</h5>
                            </div>
                            <div className="alert alert-info">
                                <h6 className="fw-bold"><i className="fa-solid fa-circle-info me-2"></i> How to setup?</h6>
                                <p className="mb-0 smaller">Go to your Cashfree Dashboard {'>'} Payment Gateway {'>'} Developer Reources {'>'} API Keys and copy the <strong>App ID</strong> and <strong>Secret Key</strong> into your <code>.env</code> file or here.</p>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold small">Cashfree App ID</label>
                                <input type="text" className="form-control font-monospace" placeholder="123456..." value={settings.cashfree_app_id || ''} onChange={(e) => setSettings({ ...settings, cashfree_app_id: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold small">Cashfree Secret Key</label>
                                <input type="password" className="form-control font-monospace" placeholder="cfsk_ma_prod_..." value={settings.cashfree_secret_key || ''} onChange={(e) => setSettings({ ...settings, cashfree_secret_key: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold small">Cashfree API Version</label>
                                <input type="text" className="form-control font-monospace" placeholder="2023-08-01" value={settings.cashfree_api_version || '2023-08-01'} onChange={(e) => setSettings({ ...settings, cashfree_api_version: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold small">Cashfree Environment</label>
                                <select className="form-select" value={settings.cashfree_mode || 'production'} onChange={(e) => setSettings({ ...settings, cashfree_mode: e.target.value })}>
                                    <option value="production">Production (Live)</option>
                                    <option value="sandbox">Sandbox (Test)</option>
                                </select>
                            </div>
                            <button className="btn btn-primary px-5 fw-bold" onClick={handleSave}>Save Keys</button>
                        </div>
                    )}

                    {activeTab === 'delivery' && (
                        <div className="animate__animated animate__fadeIn">
                            <h5 className="fw-bold mb-4">Delivery Integration</h5>
                            <div className="card border bg-light mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                            <i className="fa-solid fa-rocket"></i>
                                        </div>
                                        <h6 className="fw-bold mb-0">Recommended: Shiprocket</h6>
                                    </div>
                                    <p className="text-muted smaller">Shiprocket is the best delivery partner for e-commerce in India. It supports 29,000+ pin codes and integrates with all major carriers.</p>
                                    <ul className="smaller text-muted">
                                        <li>Automatic Label Generation</li>
                                        <li>Real-time Tracking Updates</li>
                                        <li>Discounted Shipping Rates</li>
                                    </ul>
                                    <a href="https://www.shiprocket.in/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary fw-bold">Visit Shiprocket <i className="fa-solid fa-external-link ms-1" style={{ fontSize: '10px' }}></i></a>
                                </div>
                            </div>
                            <div className="alert alert-warning">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                <strong>Manual Mode:</strong> You can currently assign <strong>Tracking Numbers</strong> and <strong>Courier Names</strong> directly in the <Link to="/admin/orders">Order Management</Link> section.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
