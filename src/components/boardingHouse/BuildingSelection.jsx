import { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Mail } from 'lucide-react';

const BuildingSelection = ({ selectedBuilding, onBuildingSelect }) => {
    const [buildings, setBuildings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBuildings();
    }, []);

    const loadBuildings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Import Supabase client
            const { supabase } = await import('../../services/supabase-client');

            const { data, error } = await supabase
                .from('toa_nha')
                .select('*')
                .order('ten_toa', { ascending: true });

            if (error) throw error;

            console.log('Loaded buildings:', data);
            setBuildings(data || []);
        } catch (err) {
            console.error('Error loading buildings:', err);
            setError('Không thể tải danh sách tòa nhà');
            // Fallback data nếu không load được từ database
            setBuildings([
                {
                    id: 1,
                    ten_toa: 'Tòa nhà A - Khu trọ cao cấp',
                    dia_chi: '123 Đường ABC, Quận 1, TP.HCM',
                    so_dien_thoai: '0123456789',
                    email: 'contact@boardinghouse.com'
                },
                {
                    id: 2,
                    ten_toa: 'Tòa nhà B - Khu trọ tiện nghi',
                    dia_chi: '456 Đường XYZ, Quận 2, TP.HCM',
                    so_dien_thoai: '0987654321',
                    email: 'info@boardinghouse.com'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-semibold">Tòa nhà bạn quan tâm</span>
                </div>
                <div className="animate-pulse space-y-3">
                    <div className="h-16 bg-white/10 rounded-lg"></div>
                    <div className="h-16 bg-white/10 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-semibold">Tòa nhà bạn quan tâm</span>
                </div>
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-400" />
                <span className="text-white font-semibold">Tòa nhà bạn quan tâm</span>
            </div>

            <div className="space-y-3">
                {buildings.map((building) => (
                    <div
                        key={building.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${selectedBuilding?.id === building.id
                                ? 'border-blue-400 bg-blue-500/20'
                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                            }`}
                        onClick={() => onBuildingSelect(building)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg mb-2">
                                    {building.ten_toa || building.name || 'Tòa nhà không tên'}
                                </h4>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-white/80">
                                        <MapPin className="h-4 w-4 text-green-400" />
                                        <span className="text-sm">
                                            {building.dia_chi || building.address || 'Chưa có địa chỉ'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-white/80">
                                        <Phone className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm">
                                            {building.so_dien_thoai || building.phone || 'Chưa có số điện thoại'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-white/80">
                                        <Mail className="h-4 w-4 text-purple-400" />
                                        <span className="text-sm">
                                            {building.email || 'Chưa có email'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-4">
                                <div className={`w-4 h-4 rounded-full border-2 ${selectedBuilding?.id === building.id
                                        ? 'border-blue-400 bg-blue-400'
                                        : 'border-white/40'
                                    }`}>
                                    {selectedBuilding?.id === building.id && (
                                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {buildings.length === 0 && (
                <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                        Hiện tại chưa có tòa nhà nào. Vui lòng liên hệ trực tiếp để được tư vấn.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BuildingSelection;
