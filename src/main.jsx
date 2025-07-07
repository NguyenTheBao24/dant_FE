import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Tạo một hàm để kiểm tra và xử lý token khi ứng dụng khởi động
const initializeApp = () => {
  // Thêm các logic khởi tạo ở đây nếu cần
  // Ví dụ: kiểm tra token, fetch user info, etc.
};

// Khởi tạo ứng dụng
initializeApp();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
