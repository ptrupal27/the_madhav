# PlantHub - React + Laravel Connection Guide

## ✅ બંને Servers Running છે:

### Backend (Laravel):
- **URL:** http://localhost:8000
- **API Base:** http://localhost:8000/api
- **Status:** ✅ Running

### Frontend (React):
- **URL:** http://localhost:5174
- **Status:** ✅ Running

---

## 🔗 API Endpoints Available:

### Authentication:
- `POST /api/register` - નવા user registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (protected)
- `GET /api/user` - Current user info (protected)

### Products:
- `GET /api/products` - બધા products
- `GET /api/products?category=fruitplant` - Category wise products
- `GET /api/products/{id}` - Single product

### Categories:
- `GET /api/categories` - બધા categories
- `GET /api/categories/{id}` - Single category

### Cart:
- `GET /api/cart` - Cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove from cart

### Orders (Protected):
- `GET /api/orders` - User orders
- `POST /api/checkout` - Place order

---

## 🧪 Testing Steps:

### 1. Homepage Test:
1. Browser માં જાઓ: `http://localhost:5174/`
2. Check કરો:
   - ✅ PlantHub logo દેખાય છે
   - ✅ Navbar working છે
   - ✅ Hero slider દેખાય છે
   - ✅ Features section (4 icons)
   - ✅ Category section
   - ✅ Products section
   - ✅ Sale section (scrolling)

### 2. Navigation Test:
1. Navbar માં કોઈ પણ category click કરો
2. Example: "Fruit Plants" → "Apple Plant"
3. Check: Products page દેખાય છે

### 3. Cart Test:
1. કોઈ પણ product પર "Add to Cart" click કરો
2. Check:
   - ✅ Alert message આવે છે
   - ✅ Cart icon માં count વધે છે
3. Cart icon click કરો
4. Check: Cart page પર products દેખાય છે

### 4. Login Test:
1. "Login" button click કરો
2. Email: test@example.com
3. Password: password
4. Submit કરો
5. Check: Backend response આવે છે

### 5. Backend Connection Test:
Browser Console માં આ command run કરો:
```javascript
fetch('http://localhost:8000/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🔧 Troubleshooting:

### CORS Error આવે તો:
```bash
# Backend restart કરો
cd "d:/jadonzipped - Copy/backend"
php artisan config:clear
php artisan serve
```

### Frontend Error આવે તો:
```bash
# Frontend restart કરો
cd "d:/jadonzipped - Copy/frontend-react"
npm run dev
```

### Database Error આવે તો:
```bash
cd "d:/jadonzipped - Copy/backend"
php artisan migrate:fresh --seed
```

---

## 📱 Available Pages:

- `/` - Home
- `/about` - About Us
- `/contact` - Contact Us
- `/login` - Login
- `/register` - Register
- `/cart` - Shopping Cart
- `/products/fruitplant` - Fruit Plants
- `/products/vegetable` - Vegetable Plants
- `/products/indoreplant` - Indoor Plants
- `/products/outdoorplant` - Outdoor Plants
- `/products/roseplant` - Rose Plants
- `/products/lilyplant` - Lily Plants
- `/products/chilliplant` - Chilli Plants
- `/products/bananaplant` - Banana Plants

---

## 🎯 Next Steps:

1. **Database Seeding:**
   ```bash
   cd backend
   php artisan db:seed --class=ProductSeeder
   ```

2. **Test API Calls:**
   - Register a new user
   - Login
   - Add products to cart
   - Place an order

3. **Production Build:**
   ```bash
   cd frontend-react
   npm run build
   ```

---

## ✅ સફળતાપૂર્વક Connected!

તમારી React frontend અને Laravel backend સફળતાપૂર્વક connect થઈ ગયા છે!

**Test કરવા માટે:**
1. Browser માં `http://localhost:5174/` ખોલો
2. કોઈ પણ product add to cart કરો
3. Cart page જુઓ

**Backend API Test:**
- `http://localhost:8000/api/products` - Browser માં ખોલો
- JSON response દેખાશે

🎉 **Website Running છે!**
