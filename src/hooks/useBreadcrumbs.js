import { useLocation } from 'react-router-dom';
import { getRouteByPath } from '../constants/routes-constant.jsx';

export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs = pathSegments.map((_, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const route = getRouteByPath(path);
    
    return {
      path,
      label: route?.data?.breadcrumb || route?.title || pathSegments[index],
      isActive: index === pathSegments.length - 1
    };
  });

  return breadcrumbs;
}; 