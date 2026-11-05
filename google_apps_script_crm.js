/**
 * @file google_apps_script_crm.js
 * @description Mã nguồn Google Apps Script giúp:
 * 1. Lưu toàn bộ thông tin khách điền form từ Website Eco Garden vào bảng tính Google Sheets (Làm CRM quản lý lâu dài).
 * 2. Tự động gửi email thông báo ngay lập tức về địa chỉ Gmail cấu hình (xxxxxx@gmail.com).
 *
 * HƯỚNG DẪN CÀI ĐẶT TRONG 2 PHÚT:
 * Bước 1: Mở Google Sheets mới tại https://sheets.new -> Đặt tên file: "CRM Khách Hàng Eco Garden".
 * Bước 2: Trên thanh menu, chọn "Tiện ích mở rộng" (Extensions) -> "Apps Script".
 * Bước 3: Xóa đoạn mã mặc định, dán toàn bộ nội dung file này vào và nhấn biểu tượng Lưu (Ctrl + S).
 * Bước 4: Nhấn nút "Triển khai" (Deploy) ở góc phải trên -> Chọn "Tùy chọn triển khai mới" (New deployment).
 *         - Chọn loại: "Ứng dụng web" (Web app)
 *         - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *         - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone)
 *         - Nhấn "Triển khai" (Deploy) -> Cấp quyền truy cập -> Copy đường dẫn "URL ứng dụng web" (Web app URL).
 * Bước 5: Mở file `js/config.js` trong thư mục web, dán URL vừa copy vào biến `googleSheetWebhookUrl`.
 */

const NOTIFICATION_EMAIL = "vanisanguyen2@gmail.com"; // Địa chỉ Gmail nhận thông báo tự động

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động tạo dòng tiêu đề nếu Sheet đang trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Mã Lead",
        "Thời gian gửi",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email Khách",
        "Căn hộ / Shophouse quan tâm",
        "Phương án tài chính",
        "Tài liệu yêu cầu",
        "Trạng thái",
        "Nguồn Form"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#07362a").setFontColor("#ffffff");
    }

    const data = JSON.parse(e.postData.contents);

    // 1. Ghi dòng dữ liệu mới vào Google Sheets
    sheet.appendRow([
      data.id || ("LEAD-" + new Date().getTime()),
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.fullName || "",
      "'" + (data.phone || ""), // Thêm dấu nháy đơn để giữ số 0 ở đầu SĐT
      data.email || "",
      data.unitInterest || "",
      data.financeOption || "",
      data.requestedDocs || "",
      data.status || "Mới đăng ký",
      data.source || "Website Eco Garden"
    ]);

    // 2. Gửi Email thông báo về Gmail quản trị
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL.indexOf("xxxxxx") === -1) {
      const subject = `[ECO GARDEN] Khách hàng mới: ${data.fullName} (${data.phone})`;
      const htmlBody = `
        <div style="font-family:Arial,sans-serif; max-width:600px; border:2px solid #0b4f3f; border-radius:10px; overflow:hidden;">
          <div style="background:#07362a; color:#f3dc8a; padding:16px 20px;">
            <h2 style="margin:0;">THÔNG BÁO KHÁCH HÀNG ĐĂNG KÝ MỚI - ECO GARDEN</h2>
          </div>
          <div style="padding:20px; line-height:1.6; color:#111827;">
            <p>Hệ thống vừa ghi nhận một khách hàng để lại thông tin tư vấn trên Website:</p>
            <table style="width:100%; border-collapse:collapse;">
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Họ và tên:</strong></td><td style="padding:8px; border-bottom:1px solid #e5e7eb;">${data.fullName}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Số điện thoại:</strong></td><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong style="color:#059669; font-size:16px;">${data.phone}</strong></td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding:8px; border-bottom:1px solid #e5e7eb;">${data.email || "Không điền"}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Sản phẩm quan tâm:</strong></td><td style="padding:8px; border-bottom:1px solid #e5e7eb;">${data.unitInterest}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Phương án tài chính:</strong></td><td style="padding:8px; border-bottom:1px solid #e5e7eb;">${data.financeOption}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Tài liệu yêu cầu:</strong></td><td style="padding:8px; border-bottom:1px solid #e5e7eb;">${data.requestedDocs}</td></tr>
              <tr><td style="padding:8px;"><strong>Thời gian đăng ký:</strong></td><td style="padding:8px;">${data.timestamp}</td></tr>
            </table>
          </div>
        </div>
      `;
      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: subject,
        htmlBody: htmlBody
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

