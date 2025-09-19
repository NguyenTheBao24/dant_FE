import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const AdminIndex = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                {/* Dashboard chính */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* 404 Route cho admin */}
                <Route
                    path="*"
                    element={
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Trang không tồn tại</h2>
                                <p className="text-gray-600 mb-4">Trang admin bạn đang tìm kiếm không được tìm thấy.</p>
                                <button
                                    onClick={() => window.location.href = '/admin/dashboard'}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                    Về Dashboard
                                </button>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </div>
    );
};

export default AdminIndex;
