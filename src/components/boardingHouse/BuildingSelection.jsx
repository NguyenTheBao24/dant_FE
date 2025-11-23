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
                <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-slate-600" />
                    <span className="text-slate-700 font-medium text-sm">Tòa nhà bạn quan tâm</span>
                </div>
                <div className="animate-pulse space-y-3">
                    <div className="h-20 bg-slate-100 rounded-lg border border-slate-200"></div>
                    <div className="h-20 bg-slate-100 rounded-lg border border-slate-200"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-slate-600" />
                    <span className="text-slate-700 font-medium text-sm">Tòa nhà bạn quan tâm</span>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium text-sm">Tòa nhà bạn quan tâm</span>
            </div>

            <div className="space-y-3">
                {buildings.map((building) => (
                    <div
                        key={building.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedBuilding?.id === building.id
                            ? 'border-slate-700 bg-slate-50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        onClick={() => onBuildingSelect(building)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-slate-900 font-semibold text-base mb-2">
                                    {building.ten_toa || building.name || 'Tòa nhà không tên'}
                                </h4>

                                <div className="space-y-1.5">
                                    <div className="flex items-center space-x-2 text-slate-600">
                                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="text-xs">
                                            {building.dia_chi || building.address || 'Chưa có địa chỉ'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-slate-600">
                                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="text-xs">
                                            {building.so_dien_thoai || building.phone || 'Chưa có số điện thoại'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-slate-600">
                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="text-xs">
                                            {building.email || 'Chưa có email'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-4">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBuilding?.id === building.id
                                    ? 'border-slate-700 bg-slate-700'
                                    : 'border-slate-300'
                                    }`}>
                                    {selectedBuilding?.id === building.id && (
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {buildings.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-700 text-sm">
                        Hiện tại chưa có tòa nhà nào. Vui lòng liên hệ trực tiếp để được tư vấn.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BuildingSelection;
