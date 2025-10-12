import { AppProvider, useApp } from './contexts/AppContext';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CatalogPage from './pages/CatalogPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import authService from './services/authService';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import CompanyPage from './pages/CompanyPage';
import HistoryPage from './pages/HistoryPage';
import StoresPage from './pages/StoresPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import React from 'react';

function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function Layout() {
  return (
    <div className="app">
      <Header />
      <main>
        <Outlet />
      </main>
      <ToastContainer />
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="admin-app">
      <Outlet />
    </div>
  );
}

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    return <AdminLoginPage onAdminLogin={() => {}} onNavigate={() => {}} />;
  }
  return children;
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/catalogo/:subcategoriaSlug" element={<CategoryPage />} />
          <Route path="/:categoriaSlug" element={<CategoryPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orden/:id" element={<OrderConfirmationPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/la-empresa" element={<CompanyPage />} />
          <Route path="/nuestra-historia" element={<HistoryPage />} />
          <Route path="/sucursales" element={<StoresPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin area isolated from ecommerce chrome */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLoginPage onAdminLogin={() => {}} onNavigate={() => {}} />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard onLogout={() => {}} />
              </ProtectedAdminRoute>
            }
          />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
