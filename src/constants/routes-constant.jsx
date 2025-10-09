import { lazy } from 'react';

// Các component lazy loading
const BoardingHouseShowcase = lazy(() => import('../pages/boardingHouse/BoardingHouseShowcase'));
const Login = lazy(() => import('../pages/login/Login'));
const AdminIndex = lazy(() => import('../pages/admin/AdminIndex'));
const ManagerIndex = lazy(() => import('../pages/manager/ManagerIndex'));



// Component placeholder cho các trang Coming Soon
const ComingSoon = ({ title }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">Trang này đang được phát triển...</p>
      <div className="space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ← Quay lại
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  </div>
);

// Component 404 Not Found
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="text-6xl mb-6">😕</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Trang không tìm thấy</h1>
      <p className="text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <div className="space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← Quay lại
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Về trang chủ
        </button>
        <button
          onClick={() => window.location.href = '/auth/login'}
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  </div>
);

// Cấu hình routes chính
export const ROUTES_CONFIG = [
  // Routes công khai
  {
    id: 'landing',
    path: '/',
    component: BoardingHouseShowcase,
    title: 'Nhà Trọ Cao Cấp',
    isAuth: false,
    isPublic: true,
    layout: 'public'
  },

  // Routes xác thực
  {
    id: 'login',
    path: '/auth/login',
    component: Login,
    title: 'Đăng nhập',
    isAuth: false,
    isPublic: true,
    layout: 'auth'
  },
  {
    id: 'admin',
    path: '/admin/*',
    component: AdminIndex,
    title: 'Admin',
    isAuth: false,
    isPublic: true,
    layout: 'admin'
  },
  {
    id: 'manager',
    path: '/manager/*',
    component: ManagerIndex,
    title: 'Manager Dashboard',
    isAuth: false,
    isPublic: true,
    layout: 'manager'
  },



];

// Hàm tiện ích
export const getRouteByPath = (path) => {
  return ROUTES_CONFIG.find(route => route.path === path);
};

export const getRouteById = (id) => {
  return ROUTES_CONFIG.find(route => route.id === id);
};

export const getPublicRoutes = () => {
  return ROUTES_CONFIG.filter(route => route.isPublic);
};

export const getProtectedRoutes = () => {
  return ROUTES_CONFIG.filter(route => route.isAuth);
};

export const getAdminRoutes = () => {
  return ROUTES_CONFIG.filter(route => route.role === 'admin');
};

export const getAllRoutes = () => {
  return ROUTES_CONFIG;
};

// Hằng số route cũ để tương thích ngược
export const PUBLIC_ROUTES = {
  LANDING: '/',
  BOARDING_HOUSE: '/boarding-house',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password'
};

