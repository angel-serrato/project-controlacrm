import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPassword from './pages/auth/ForgotPasswordPage';
import ResetPassword from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomerPage from './pages/customers/CustomerPage';
import ProductPage from './pages/products/ProductPage';
import OrderPage from './pages/orders/OrderPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      <Route path="dashboard" element={<DashboardPage />}>
        <Route path="customers" element={<CustomerPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="orders" element={<OrderPage />} />
      </Route>
    </Route>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
