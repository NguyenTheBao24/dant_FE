import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ManagerDashboard } from "@/components/manager/pages/ManagerDashboard";
import {
  getQuanLyByTaiKhoanId,
  getToaNhaByQuanLy,
} from "@/services/quan-ly.service";
import { listCanHoByToaNha } from "@/services/can-ho.service";

export default function ManagerIndex() {
  const navigate = useNavigate();
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadManagerData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Kiểm tra authentication
        const authUser = sessionStorage.getItem("auth_user");
        if (!authUser) {
          navigate("/auth/login");
          return;
        }

        const userData = JSON.parse(authUser);
        console.log("Manager user data:", userData);

        if (userData.role !== "quan_ly") {
          alert("Bạn không có quyền truy cập trang này");
          navigate("/auth/login");
          return;
        }

        // Tìm quản lý trong database
        const quanLy = await getQuanLyByTaiKhoanId(userData.id);
        console.log("Found quan ly:", quanLy);

        if (!quanLy) {
          setError("Không tìm thấy thông tin quản lý");
          return;
        }

        // Tìm tòa nhà mà quản lý này quản lý
        const toaNhaList = await getToaNhaByQuanLy(quanLy.id);
        console.log("Found toa nha list:", toaNhaList);

        if (!toaNhaList || toaNhaList.length === 0) {
          setError("Bạn chưa được phân công quản lý tòa nhà nào");
          return;
        }

        // Lấy tòa nhà đầu tiên (có thể có nhiều tòa nhà)
        const toaNha = toaNhaList[0];
        console.log("Selected toa nha:", toaNha);
        console.log("Toa nha fields:", Object.keys(toaNha));
        console.log("Toa nha details:", {
          id: toaNha.id,
          ten: toaNha.ten_toa || toaNha.ten || toaNha.name,
          dia_chi: toaNha.dia_chi || toaNha.address,
          so_dien_thoai: toaNha.so_dien_thoai || toaNha.phone,
          quan_ly_id: toaNha.quan_ly_id,
        });

        // Load dữ liệu phòng cho tòa nhà này
        console.log("Loading rooms for toa nha ID:", toaNha.id);
        const canHoList = await listCanHoByToaNha(toaNha.id);
        console.log("Found can ho list:", canHoList);

        // Thêm dữ liệu phòng và thông tin quản lý vào tòa nhà
        const toaNhaWithRooms = {
          ...toaNha,
          can_ho: canHoList,
          quan_ly: quanLy, // Thêm thông tin quản lý vào selectedHostel
        };

        console.log("Final toa nha with rooms:", toaNhaWithRooms);
        setSelectedHostel(toaNhaWithRooms);
      } catch (error) {
        console.error("Error loading manager data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    loadManagerData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Đang tải dữ liệu khu trọ...
          </h3>
          <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (!selectedHostel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">
            Bạn chưa được phân công quản lý tòa nhà nào
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerDashboard selectedHostel={selectedHostel} />
    </div>
  );
}
