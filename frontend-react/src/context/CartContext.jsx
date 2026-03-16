import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

// Resolve multilingual name {en, hi, gu} → plain string
const resolveName = (name) => {
    if (!name) return '';
    if (typeof name === 'object') {
        const lang = localStorage.getItem('i18nextLng') || 'en';
        return name[lang] || name.en || Object.values(name)[0] || '';
    }
    return String(name);
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filter out duplicates and merge local with backend
    const mergeCarts = (backendItems, localItems) => {
        const merged = [...backendItems];
        localItems.forEach(localItem => {
            // Check if item already exists in backend by name (since IDs differ)
            const exists = merged.find(b => b.name === localItem.name);
            if (!exists) {
                merged.push(localItem);
            }
        });
        return merged;
    };

    const syncLocalCartWithServer = async () => {
        const token = localStorage.getItem('token');
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (token && localCart.length > 0) {
            console.log('Syncing local cart to server...');
            const successfullySynced = [];
            const failedToSync = [];

            for (const item of localCart) {
                // If it's a real product (has a valid numeric/uuid ID), sync it
                const isValidId = item.product_id && (typeof item.product_id === 'number' || /^[0-9a-f-]{32,36}$/i.test(item.product_id));
                if (isValidId) {
                    try {
                        await api.addToCart(item.product_id, item.quantity);
                        successfullySynced.push(item);
                        console.log('✅ Synced item:', item.name);
                    } catch (e) {
                        console.error('❌ Failed to sync item:', item.name);
                        failedToSync.push(item);
                    }
                } else {
                    // Keep mock items in local storage
                    failedToSync.push(item);
                }
            }

            // Only keep items that failed to sync in localStorage
            if (failedToSync.length > 0) {
                localStorage.setItem('cart', JSON.stringify(failedToSync));
                console.log('💾 Kept failed/mock items in localStorage:', failedToSync);
            } else {
                localStorage.removeItem('cart');
                console.log('✨ All items synced successfully, cleared localStorage');
            }
        }
    };

    const fetchCart = async () => {
        try {
            await syncLocalCartWithServer(); // Sync before fetching
            const response = await api.getCart();
            console.log('🛒 Raw Cart API Response:', response);
            const rawItems = response.cart?.items || [];
            const normalizedBackendItems = rawItems.map(item => ({
                id: item.id, // Database CartItem ID
                product_id: item.product_id,
                name: typeof item.product?.name === 'object' ? (item.product.name.en || Object.values(item.product.name)[0]) : item.product?.name,
                price: item.product?.price,
                img: item.product?.image,
                quantity: item.quantity,
                is_mock: false
            }));

            const localCart = JSON.parse(localStorage.getItem('cart') || '[]').map(item => ({
                ...item,
                img: item.img || item.image
            }));
            const finalItems = mergeCarts(normalizedBackendItems, localCart);

            console.log('📦 Cart fetched:', finalItems);
            setCartItems(finalItems);
            setCartCount(finalItems.length);
        } catch (error) {
            console.log('Cart fetch sync failed, using local storage only');
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]').map(item => ({
                ...item,
                img: item.img || item.image
            }));
            console.log('📦 Local cart:', localCart);
            setCartItems(localCart);
            setCartCount(localCart.length);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        setLoading(true);
        const isValidId = product.id && (typeof product.id === 'number' || /^[0-9a-f-]{32,36}$/i.test(product.id));

        console.log('➕ Adding to cart:', product);
        console.log('🔑 Valid ID?', isValidId);

        try {
            if (isValidId && localStorage.getItem('token')) {
                await api.addToCart(product.id, quantity);
                await fetchCart();
                return { success: true, message: 'Added to your secure cart!' };
            } else {
                throw new Error('Using local storage');
            }
        } catch (error) {
            console.log('💾 Using local storage for cart');
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = localCart.find(item => item.name === product.name);

            if (existingItem) {
                existingItem.quantity += quantity;
                console.log('📝 Updated existing item quantity');
            } else {
                localCart.push({
                    id: `local-${Date.now()}`,
                    product_id: isValidId ? product.id : null,
                    name: resolveName(product.name),
                    price: product.price,
                    img: product.image || product.img,
                    quantity: quantity,
                    is_mock: !isValidId
                });
                console.log('✨ Added new item to cart');
            }

            localStorage.setItem('cart', JSON.stringify(localCart));
            console.log('💾 Cart saved to localStorage:', localCart);
            await fetchCart(); // Re-sync state
            return { success: true, message: 'Added to local cart!' };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        setLoading(true);
        try {
            const item = cartItems.find(i => i.id === itemId);
            if (item && !item.is_mock && localStorage.getItem('token')) {
                await api.removeCartItem(itemId);
            } else {
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const updatedLocal = localCart.filter(i => i.id !== itemId && i.name !== item?.name);
                localStorage.setItem('cart', JSON.stringify(updatedLocal));
            }
            await fetchCart();
        } catch (error) {
            console.error('Delete failed:', error);
            const localCart = cartItems.filter(item => item.id !== itemId);
            setCartItems(localCart);
            setCartCount(localCart.length);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        setLoading(true);
        try {
            const item = cartItems.find(i => i.id === itemId);
            if (item && !item.is_mock && localStorage.getItem('token')) {
                await api.updateCartItem(itemId, quantity);
            } else {
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const updatedLocal = localCart.map(i =>
                    (i.id === itemId || i.name === item?.name) ? { ...i, quantity } : i
                );
                localStorage.setItem('cart', JSON.stringify(updatedLocal));
            }
            await fetchCart();
        } catch (error) {
            const updatedItems = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );
            setCartItems(updatedItems);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = () => {
        localStorage.removeItem('cart');
        setCartItems([]);
        setCartCount(0);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const value = {
        cartItems,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
