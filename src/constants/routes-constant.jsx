import { lazy } from 'react';

// Các component lazy loading
const BoardingHouseShowcase = lazy(() => import('../pages/boardingHouse/BoardingHouseShowcase'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const Home = lazy(() => import('../pages/Home'));
const Rooms = lazy(() => import('../pages/Rooms'));
const Tenants = lazy(() => import('../pages/Tenants'));
const Bills = lazy(() => import('../pages/Bills'));
const Maintenance = lazy(() => import('../pages/Maintenance'));
const Settings = lazy(() => import('../pages/Settings'));

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
    id: 'register',
    path: '/auth/register',
    component: Register,
    title: 'Đăng ký',
    isAuth: false,
    isPublic: true,
    layout: 'auth'
  },
  {
    id: 'forgot-password',
    path: '/auth/forgot-password',
    component: ForgotPassword,
    title: 'Quên mật khẩu',
    isAuth: false,
    isPublic: true,
    layout: 'auth'
  },

  // Routes được bảo vệ
  {
    id: 'home',
    path: '/home',
    component: Home,
    title: 'Trang chủ',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Trang chủ'
  },
  {
    id: 'dashboard',
    path: '/dashboard',
    component: Home,
    title: 'Dashboard',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Dashboard'
  },
  {
    id: 'rooms',
    path: '/rooms',
    component: Rooms,
    title: 'Quản lý phòng',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Quản lý phòng'
  },
  {
    id: 'tenants',
    path: '/tenants',
    component: Tenants,
    title: 'Quản lý người thuê',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Quản lý người thuê'
  },
  {
    id: 'bills',
    path: '/bills',
    component: Bills,
    title: 'Quản lý hóa đơn',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Quản lý hóa đơn'
  },
  {
    id: 'maintenance',
    path: '/maintenance',
    component: Maintenance,
    title: 'Bảo trì',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Bảo trì'
  },
  {
    id: 'settings',
    path: '/settings',
    component: Settings,
    title: 'Cài đặt',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    breadcrumb: 'Cài đặt'
  },

  // Routes chủ trọ (Sắp ra mắt)
  {
    id: 'landlord',
    path: '/landlord',
    component: () => <ComingSoon title="Dashboard Chủ Trọ" />,
    title: 'Dashboard Chủ Trọ',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    comingSoon: true
  },
  {
    id: 'landlord-dashboard',
    path: '/landlord/dashboard',
    component: () => <ComingSoon title="Dashboard Chủ Trọ" />,
    title: 'Dashboard Chủ Trọ',
    isAuth: true,
    isPublic: false,
    layout: 'dashboard',
    comingSoon: true
  },

  // Routes quản trị (Sắp ra mắt)
  {
    id: 'admin',
    path: '/admin',
    component: () => <ComingSoon title="Quản Trị Viên" />,
    title: 'Quản Trị Viên',
    isAuth: true,
    isPublic: false,
    layout: 'admin',
    role: 'admin',
    comingSoon: true
  },
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    component: () => <ComingSoon title="Dashboard Admin" />,
    title: 'Dashboard Admin',
    isAuth: true,
    isPublic: false,
    layout: 'admin',
    role: 'admin',
    comingSoon: true
  },
  {
    id: 'admin-users',
    path: '/admin/users',
    component: () => <ComingSoon title="Quản Lý Người Dùng" />,
    title: 'Quản Lý Người Dùng',
    isAuth: true,
    isPublic: false,
    layout: 'admin',
    role: 'admin',
    comingSoon: true
  },
  {
    id: 'admin-rooms',
    path: '/admin/rooms',
    component: () => <ComingSoon title="Quản Lý Phòng (Admin)" />,
    title: 'Quản Lý Phòng (Admin)',
    isAuth: true,
    isPublic: false,
    layout: 'admin',
    role: 'admin',
    comingSoon: true
  },
  {
    id: 'admin-tenants',
    path: '/admin/tenants',
    component: () => <ComingSoon title="Quản Lý Người Thuê (Admin)" />,
    title: 'Quản Lý Người Thuê (Admin)',
    isAuth: true,
    isPublic: false,
    layout: 'admin',
    role: 'admin',
    comingSoon: true
  },
  {
    id: 'admin-settings',
    path: '/admin/settings',
    component: () => <ComingSoon title="Cài Đặt Hệ Thống" />,
    title: 'Cài Đặt Hệ Thống',
    isAuth: true,
    isPublic: false,
    layout: 'admin',
    role: 'admin',
    comingSoon: true
  },

  // Route 404
  {
    id: 'not-found',
    path: '*',
    component: NotFound,
    title: '404 - Không tìm thấy trang',
    isAuth: false,
    isPublic: true,
    layout: 'public'
  }
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

export const PROTECTED_ROUTES = {
  HOME: '/home',
  DASHBOARD: '/dashboard',
  ROOMS: '/rooms',
  TENANTS: '/tenants',
  BILLS: '/bills',
  MAINTENANCE: '/maintenance',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

export const LANDLORD_ROUTES = {
  MAIN: '/landlord',
  DASHBOARD: '/landlord/dashboard'
};

export const ADMIN_ROUTES = {
  MAIN: '/admin',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  ROOMS: '/admin/rooms',
  TENANTS: '/admin/tenants',
  SETTINGS: '/admin/settings'
};
