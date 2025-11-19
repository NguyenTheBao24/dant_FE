import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Trash2,
  Database,
  Copy,
  Code,
} from "lucide-react";
// @ts-ignore
import {
  resetAllInvoices,
  checkMaHoaDonColumn,
  getSetupSQLScript,
  generateMaHoaDonForExistingInvoices,
} from "@/utils/reset-invoices";

export function ResetInvoicesPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [maHoaDonStatus, setMaHoaDonStatus] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<any>(null);
  const sqlScript = getSetupSQLScript();

  const handleCheckMaHoaDon = async () => {
    const status = await checkMaHoaDonColumn();
    setMaHoaDonStatus(status);
  };

  const handleReset = async () => {
    // Xác nhận trước khi xóa
    const confirmed = window.confirm(
      "⚠️ CẢNH BÁO: Bạn có chắc chắn muốn XÓA TẤT CẢ hóa đơn?\n\n" +
        "Thao tác này không thể hoàn tác. Vui lòng đảm bảo đã backup dữ liệu nếu cần.\n\n" +
        "Click OK để tiếp tục."
    );

    if (!confirmed) return;

    const userInput = window.prompt(
      'Nhập "RESET" để xác nhận xóa tất cả hóa đơn:'
    );
    if (userInput !== "RESET") {
      alert("Xác nhận không đúng. Đã hủy thao tác.");
      return;
    }

    setIsResetting(true);
    setResult(null);

    try {
      const resetResult = await resetAllInvoices();
      setResult(resetResult);

      // Reset lại status check sau khi xóa
      if (resetResult.success) {
        setMaHoaDonStatus(null);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlScript);
    alert("Đã copy SQL script vào clipboard!");
  };

  const handleGenerateMaHoaDon = async () => {
    setIsGenerating(true);
    setGenerateResult(null);

    try {
      const generateResult = await generateMaHoaDonForExistingInvoices();
      setGenerateResult(generateResult);
    } catch (error: any) {
      setGenerateResult({
        success: false,
        error: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Hóa Đơn & Setup Mã Hóa Đơn
        </h1>
        <p className="text-gray-600">
          Trang này dùng để reset dữ liệu hóa đơn và thiết lập format mã hóa đơn
          mới
        </p>
      </div>

      {/* Kiểm tra cột ma_hoa_don */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Kiểm tra Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Kiểm tra xem cột{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">ma_hoa_don</code> đã
            được tạo chưa
          </p>

          <Button onClick={handleCheckMaHoaDon} variant="outline">
            Kiểm tra
          </Button>

          {maHoaDonStatus && (
            <div
              className={`p-4 rounded-lg ${
                maHoaDonStatus.exists
                  ? "bg-green-50 border border-green-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <div className="flex items-center">
                {maHoaDonStatus.exists ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      ✅ Cột ma_hoa_don đã tồn tại
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      ⚠️ Cột ma_hoa_don chưa được tạo
                    </span>
                  </>
                )}
              </div>
              {!maHoaDonStatus.exists && (
                <p className="text-sm text-yellow-700 mt-2">
                  Vui lòng chạy SQL script ở bên dưới để tạo cột và trigger.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SQL Script Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              SQL Script Setup Database
            </div>
            <Button onClick={handleCopySQL} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy SQL
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              📋 Hướng dẫn:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Copy SQL script bên dưới</li>
              <li>Mở Supabase SQL Editor (nếu có quyền truy cập)</li>
              <li>
                Hoặc sử dụng Supabase CLI:{" "}
                <code className="bg-blue-100 px-1 rounded">
                  supabase db execute --file script.sql
                </code>
              </li>
              <li>
                Hoặc nhờ admin có quyền truy cập Supabase Dashboard chạy script
                này
              </li>
              <li>Sau khi chạy script, click "Kiểm tra" lại để xác nhận</li>
            </ol>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {sqlScript}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Tạo mã cho hóa đơn hiện có */}
      {maHoaDonStatus?.exists && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Tạo Mã Hóa Đơn Cho Dữ Liệu Hiện Có
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Nếu bạn đã có hóa đơn trong database nhưng chưa có mã, có thể tạo
              mã cho chúng ở đây.
            </p>

            <Button
              onClick={handleGenerateMaHoaDon}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Đang tạo mã...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Tạo Mã Cho Hóa Đơn Hiện Có
                </>
              )}
            </Button>

            {generateResult && (
              <div
                className={`p-4 rounded-lg ${
                  generateResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {generateResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-semibold ${
                        generateResult.success
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {generateResult.success ? "✅ Thành công" : "❌ Thất bại"}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        generateResult.success
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {generateResult.message || generateResult.error}
                    </p>
                    {generateResult.success &&
                      generateResult.updatedCount !== undefined && (
                        <p className="text-sm text-green-700 mt-1">
                          Đã tạo mã cho:{" "}
                          <strong>{generateResult.updatedCount}</strong> hóa đơn
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reset hóa đơn */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <Trash2 className="h-5 w-5 mr-2" />
            Reset Tất Cả Hóa Đơn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-2">⚠️ CẢNH BÁO:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Thao tác này sẽ <strong>XÓA TẤT CẢ</strong> hóa đơn trong
                    database
                  </li>
                  <li>Không thể hoàn tác sau khi xóa</li>
                  <li>
                    Đảm bảo đã chạy SQL script setup trước khi reset (nếu muốn
                    tạo mã tự động)
                  </li>
                  <li>
                    Hóa đơn mới sẽ tự động có mã theo format:{" "}
                    <code className="bg-red-100 px-1 rounded">
                      HD-YYYYMM-XXXX
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleReset}
            disabled={isResetting}
            variant="destructive"
            className="w-full"
          >
            {isResetting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Tất Cả Hóa Đơn
              </>
            )}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.success ? "✅ Thành công" : "❌ Thất bại"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      result.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.message || result.error}
                  </p>
                  {result.success && result.deletedCount !== undefined && (
                    <p className="text-sm text-green-700 mt-1">
                      Đã xóa: <strong>{result.deletedCount}</strong> hóa đơn
                    </p>
                  )}
                  {result.success && (
                    <p className="text-sm text-blue-700 mt-2">
                      💡 Sau khi reset, nếu đã setup trigger, hóa đơn mới sẽ tự
                      động có mã theo format HD-YYYYMM-XXXX
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
