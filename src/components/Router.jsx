import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';

// Import cấu hình route
import { ROUTES_CONFIG } from '../constants/routes-constant.jsx';

// Component loading cho lazy-loaded routes
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {ROUTES_CONFIG.map((route) => {
            const Component = route.component;

            return (
              <Route
                key={route.id}
                path={route.path}
                element={<Component />}
              />
            );
          })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router; 