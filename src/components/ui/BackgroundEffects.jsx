import React from 'react';

const BackgroundEffects = () => {
    return (
        <>
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
        </>
    );
};

export default BackgroundEffects; 