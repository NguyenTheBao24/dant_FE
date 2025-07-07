import { useLocation } from 'react-router-dom';
import { getRouteByPath } from '../constants/routes-constant.jsx';

export const useRouteData = () => {
  const location = useLocation();
  const route = getRouteByPath(location.pathname);
  
  return {
    data: route?.data || {},
    title: route?.title,
    path: route?.path,
    isProtected: !!route?.guard,
  };
}; 