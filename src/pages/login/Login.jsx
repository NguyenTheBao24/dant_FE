import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/logoHome.png';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mô phỏng đăng nhập
        console.log('Login:', formData);
        // Chuyển hướng đến dashboard sau khi đăng nhập thành công
        navigate('/home');
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Nền động */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Các hạt bay lơ lửng */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-yellow-300/40 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300/50 rounded-full animate-bounce animation-delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-float animation-delay-3000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-lg w-full">
                    <div className="relative group">
                        {/* Hiệu ứng phát sáng */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>

                        {/* Container form chính */}
                        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-12 shadow-2xl">
                            {/* Góc trang trí */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-br-full rounded-tl-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-tl-full rounded-br-3xl"></div>

                            {/* Header với logo */}
                            <div className="text-center mb-10 relative z-10">
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <img
                                        src={logoHome}
                                        alt="Nhà Trọ Logo"
                                        className="relative w-20 h-20 rounded-full shadow-lg mx-auto"
                                    />
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                    <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                                        Nhà Trọ Cao Cấp
                                    </span>
                                </h1>
                                <p className="text-lg bg-gradient-to-r from-gray-200 to-indigo-200 bg-clip-text text-transparent font-medium">
                                    Premium Boarding House
                                </p>

                                <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">Đăng Nhập</h2>
                                    <p className="text-blue-100">Chào mừng bạn quay trở lại!</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="group/input">
                                    <label className="block text-white font-semibold mb-3">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15"
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>

                                <div className="group/input">
                                    <label className="block text-white font-semibold mb-3">
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 group-hover/input:bg-white/15 focus:bg-white/15"
                                        placeholder="Nhập mật khẩu"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer group/checkbox">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
                                        />
                                        <span className="ml-3 text-blue-100 group-hover/checkbox:text-white transition-colors">
                                            Ghi nhớ đăng nhập
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="group/btn relative w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-6 rounded-2xl text-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                                >
                                    <span className="relative z-10">
                                        Đăng Nhập
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                                    {/* Animation nút */}
                                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                                        <div className="absolute top-2 left-8 w-1 h-1 bg-white rounded-full animate-ping"></div>
                                        <div className="absolute top-4 right-12 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300"></div>
                                        <div className="absolute bottom-3 left-16 w-1 h-1 bg-white rounded-full animate-ping animation-delay-600"></div>
                                        <div className="absolute bottom-2 right-20 w-1 h-1 bg-white rounded-full animate-ping animation-delay-900"></div>
                                    </div>
                                </button>

                                {/* Nút về trang chủ */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="group/home relative px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
                                    >
                                        <span className="relative z-10">
                                            Về trang chủ
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 