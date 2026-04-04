const rawApiUrl = import.meta.env.VITE_API_URL || 'https://themadhav.com/api';
export const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://themadhav.com';

// Use BASE_URL for storage, removing trailing slash if present
const STORAGE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/400x300?text=No+Image';

    let cleanPath = String(path).trim();

    // Data URI (Base64) - common for home products using reader.readAsDataURL
    if (cleanPath.startsWith('data:')) return cleanPath;

    // Full URL - return as is
    if (cleanPath.startsWith('http')) return cleanPath;

    // Remove leading slash for consistency
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

    // Common path adjustments
    if (cleanPath.startsWith('public/')) cleanPath = cleanPath.substring(7);
    if (cleanPath.startsWith('storage/')) cleanPath = cleanPath.substring(8);

    // Ensure we don't have double storage/
    // Resulting URL should be BASE_URL/storage/path
    const finalUrl = `${STORAGE_URL}/storage/${cleanPath}`;
    
    // Debug log (can be removed later)
    // console.log('Resolved Image URL:', { input: path, output: finalUrl });
    
    return finalUrl;
};


const api = {
    // Helper to get headers
    getHeaders: () => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Session-ID': localStorage.getItem('session_id') || ''
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Generic request handler
    request: async (endpoint, method = 'GET', body = null) => {
        const options = {
            method,
            headers: api.getHeaders(),
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            console.log(`API Request: ${method} ${API_URL}${endpoint}`, body);
            const response = await fetch(`${API_URL}${endpoint}`, options);

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const text = await response.text();
                const isHtml = text.trim().startsWith('<!doctype html>') || text.trim().startsWith('<html');
                const errorMessage = isHtml
                    ? 'Invalid server response: Received HTML instead of JSON. This usually means the API URL is incorrect or the server is redirecting to the index page (SPA routing issue).'
                    : 'Invalid server response (not JSON)';

                console.error('Non-JSON response received:', text);
                throw {
                    status: response.status,
                    message: errorMessage,
                    text: text.substring(0, 500) + (text.length > 500 ? '...' : '')
                };
            }

            // Track session ID if returned (for guest carts)
            if (data.session_id) {
                localStorage.setItem('session_id', data.session_id);
            }

            if (!response.ok) {
                // Throw error object with status and data
                throw { status: response.status, ...data };
            }
            return data;
        } catch (error) {
            console.error('Detailed API Error:', JSON.stringify(error, null, 2));
            throw error;
        }
    },

    // Auth methods
    login: (email, password) => api.request('/login', 'POST', { email, password }),
    register: (data) => api.request('/register', 'POST', data),
    logout: () => api.request('/logout', 'POST'),
    getUser: () => api.request('/user'),

    // Product methods
    getProducts: (params = '') => api.request(`/products${params}`),
    getProduct: (id) => api.request(`/products/${id}`),

    // Category methods
    getCategories: () => api.request('/categories'),
    getCategory: (id) => api.request(`/categories/${id}`),

    // Cart methods
    getCart: () => api.request('/cart'),
    addToCart: (productId, quantity) => api.request('/cart/add', 'POST', { product_id: productId, quantity }),
    updateCartItem: (itemId, quantity) => api.request(`/cart/items/${itemId}`, 'PUT', { quantity }),
    removeCartItem: (itemId) => api.request(`/cart/items/${itemId}`, 'DELETE'),

    // Order methods
    placeOrder: (data) => api.request('/checkout', 'POST', data),
    verifyPayment: (data) => api.request('/verify-payment', 'POST', data),
    getOrders: () => api.request('/orders'),
};

export default api;
