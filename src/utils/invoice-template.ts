interface InvoiceDetailsPayload {
  invoice: any;
  breakdown: {
    tienPhong: number;
    tienDien: number;
    tienNuoc: number;
    tienDichVu: number;
    chiSoDienCu: number;
    chiSoDienMoi: number;
    chiSoNuocCu: number;
    chiSoNuocMoi: number;
    soKwh: number;
    soM3: number;
    giaDien: number;
    giaNuoc: number;
    giaDichVu: number;
  };
}

interface InvoiceTemplateOptions {
  hostelName?: string;
  hostelAddress?: string;
  tenantName?: string;
  roomNumber?: string;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const formatDate = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

export function buildInvoiceHtml(
  details: InvoiceDetailsPayload,
  options: InvoiceTemplateOptions = {}
) {
  const { invoice, breakdown } = details;
  const createdAt = formatDate(invoice?.ngay_tao);
  const paidAt = formatDate(invoice?.ngay_thanh_toan);

  return `<!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Hoa don ${invoice?.id || ""}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 24px;
          background-color: #f7f7f7;
          color: #111827;
        }
        .invoice {
          background: #ffffff;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #1d4ed8;
        }
        .meta {
          text-align: right;
          font-size: 14px;
          color: #6b7280;
        }
        .section {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .info-item {
          font-size: 14px;
          color: #374151;
        }
        .info-label {
          font-weight: 600;
          color: #6b7280;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        th, td {
          padding: 12px 16px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background: #f8fafc;
        }
        .amount {
          text-align: right;
          font-weight: 600;
          color: #111827;
        }
        .total-row {
          background: #1d4ed8;
          color: #ffffff;
        }
        .total-row td {
          font-size: 16px;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div>
            <h1 class="title">Hóa đơn #${invoice?.id || ""}</h1>
            <p>${options.hostelName || "Khu trọ"}</p>
            <p>${options.hostelAddress || ""}</p>
          </div>
          <div class="meta">
            <p>Ngày tạo: ${createdAt}</p>
            ${
              paidAt
                ? `<p>Thanh toán: ${paidAt}</p>`
                : `<p>Trạng thái: ${
                    invoice?.trang_thai === "da_thanh_toan"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"
                  }</p>`
            }
          </div>
        </div>

        <div class="section">
          <div class="section-title">Thông tin khách thuê</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Khách thuê:</span>
              <div>${options.tenantName || "Không xác định"}</div>
            </div>
            <div class="info-item">
              <span class="info-label">Phòng:</span>
              <div>${options.roomNumber || "N/A"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Chi tiết chỉ số</div>
          <table>
            <tr>
              <th>Hạng mục</th>
              <th>Chỉ số cũ</th>
              <th>Chỉ số mới</th>
              <th>Sử dụng</th>
            </tr>
            <tr>
              <td>Điện</td>
              <td>${breakdown.chiSoDienCu}</td>
              <td>${breakdown.chiSoDienMoi}</td>
              <td>${breakdown.soKwh} kWh</td>
            </tr>
            <tr>
              <td>Nước</td>
              <td>${breakdown.chiSoNuocCu}</td>
              <td>${breakdown.chiSoNuocMoi}</td>
              <td>${breakdown.soM3} m³</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Chi phí</div>
          <table>
            <tr>
              <th>Hạng mục</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
            <tr>
              <td>Tiền phòng</td>
              <td>-</td>
              <td class="amount">${formatCurrency(breakdown.tienPhong)}</td>
            </tr>
            <tr>
              <td>Tiền điện</td>
              <td>${formatCurrency(breakdown.giaDien)}</td>
              <td class="amount">${formatCurrency(breakdown.tienDien)}</td>
            </tr>
            <tr>
              <td>Tiền nước</td>
              <td>${formatCurrency(breakdown.giaNuoc)}</td>
              <td class="amount">${formatCurrency(breakdown.tienNuoc)}</td>
            </tr>
            <tr>
              <td>Dịch vụ</td>
              <td>${formatCurrency(breakdown.giaDichVu)}</td>
              <td class="amount">${formatCurrency(breakdown.tienDichVu)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">TỔNG CỘNG</td>
              <td class="amount">${formatCurrency(invoice?.so_tien || 0)}</td>
            </tr>
          </table>
        </div>
      </div>
    </body>
  </html>`;
}
