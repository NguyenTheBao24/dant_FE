import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/logoHome.png';
import { loginTaiKhoan } from '@/services/tai-khoan.service';


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const account = await loginTaiKhoan(formData.username, formData.password)
            if (!account) {
                alert('Sai tài khoản hoặc mật khẩu')
                return
            }
            // Log thông tin tài khoản đang đăng nhập
            console.log('Đăng nhập thành công:', {
                id: account.id,
                username: account.username,
                role: account.role,
            })
            // Lưu thông tin tối thiểu cho phiên làm việc
            sessionStorage.setItem('auth_user', JSON.stringify({
                id: account.id,
                username: account.username,
                role: account.role,
            }))

            if (account.role === 'admin') {
                navigate('/admin/dashboard')
            } else if (account.role === 'quan_ly') {
                // Điều hướng vào manager dashboard
                navigate('/manager')
            } else if (account.role === 'khach_thue') {
                // Điều hướng vào employ dashboard
                navigate('/employ')
            } else {
                alert('Vai trò không được hỗ trợ')
            }
        } catch (err) {
            console.error('Login failed:', err)
            alert('Không thể đăng nhập. Vui lòng thử lại.')
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-white">
            {/* Nền tối giản */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">
                    <div className="relative bg-white border border-slate-200 rounded-xl p-10 md:p-12 shadow-sm">
                        {/* Header với logo */}
                        <div className="text-center mb-10">
                            <div className="inline-block mb-6">
                                <img
                                    src={logoHome}
                                    alt="Nhà Trọ Logo"
                                    className="w-16 h-16 rounded-full mx-auto"
                                />
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">
                                Nhà Trọ Cao Cấp
                            </h1>
                            <p className="text-sm text-slate-500 font-medium mb-6">
                                Premium Boarding House
                            </p>

                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-slate-900 mb-2">Đăng Nhập</h2>
                                <p className="text-sm text-slate-600">Chào mừng bạn quay trở lại!</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-slate-700 font-medium mb-2 text-sm">
                                    Tài khoản
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-400"
                                    placeholder="Nhập tài khoản của bạn"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2 text-sm">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-400"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-slate-600 bg-white border-slate-300 rounded focus:ring-slate-600 focus:ring-2"
                                    />
                                    <span className="ml-2 text-sm text-slate-600">
                                        Ghi nhớ đăng nhập
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-3.5 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-slate-800 hover:shadow-lg"
                            >
                                Đăng Nhập
                            </button>

                            {/* Nút về trang chủ */}
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 text-sm"
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 