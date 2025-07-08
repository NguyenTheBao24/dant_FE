const AmenityCard = ({ icon, title, desc }) => {
    return (
        <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>

            {/* Main card */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group-hover:bg-white/90">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-full rounded-tr-2xl"></div>

                {/* Icon container */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center">
                            {icon}
                        </div>
                    </div>

                    {/* Floating circles */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-pulse animation-delay-1000 group-hover:animate-bounce"></div>
                </div>

                {/* Content */}
                <div className="text-center">
                    <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                        {title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {desc}
                    </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </div>
    );
};

export default AmenityCard; 