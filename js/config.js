/**
 * @file config.js
 * @description Cấu hình trung tâm cho hệ thống Website Tư vấn & Quản lý Bảng hàng Eco Garden.
 * Tách biệt cấu hình (Email, Webhook CRM, Hotline, Thông số tài chính) khỏi logic xử lý
 * để dễ dàng thay đổi hoặc tái sử dụng mà không cần can thiệp vào mã nguồn giao diện.
 */

const APP_CONFIG = {
    // 1. Thông tin liên hệ & Nhận thông báo Lead khách hàng
    targetEmail: "chatgpt0912k3@gmail.com",          // Địa chỉ email nhận thông báo khi khách điền form
    hotline: "0988.686.888",                  // Số điện thoại Hotline hiển thị trên trang
    hotlineRaw: "0988686888",                 // Số điện thoại gọi trực tiếp qua giao thức tel:
    zaloUrl: "https://zalo.me/0988686888",    // Liên kết mở chat Zalo tư vấn trực tiếp

    // 2. Cấu hình Lưu trữ dữ liệu Khách hàng (Cloud CRM + Local CRM)
    // Dán URL Web App của Google Apps Script vào đây để tự động lưu vào Google Sheets & gửi Gmail
    googleSheetWebhookUrl: "",
    // Sử dụng dịch vụ FormSubmit.co (không cần backend) làm kênh dự phòng gửi thẳng về targetEmail
    enableDirectEmailFallback: true,
    localStorageKey: "ECO_GARDEN_CRM_LEADS_V1",
    adminPin: "2026",                         // Mã PIN mở bảng Quản trị Lead (CRM) ngay trên web

    // 3. Thông số mặc định cho Công cụ Tính dòng tiền & Lãi suất vay ngân hàng
    financeDefaults: {
        maxLoanRatio: 70,                     // Tỷ lệ vay tối đa (%)
        defaultLoanRatio: 70,                 // Tỷ lệ vay mặc định khi mở máy tính (%)
        defaultTermYears: 20,                 // Thời hạn vay mặc định (năm)
        htlsMonths: 24,                       // Số tháng Hỗ trợ lãi suất 0% (theo CSBH 4 KHÔNG - 4 CÓ)
        postHtlsRate: 8.5,                    // Lãi suất dự kiến sau thời gian ưu đãi (%/năm)
        earlyPaymentDiscount: 15.0,           // Chiết khấu Thanh toán sớm 95% (kết hợp ưu đãi tới 23%)
        rentalGuaranteeRate: 5.0,             // Cam kết thuê lại (%/năm trong 24 tháng)
        noRentalGuaranteeDiscount: 8.0,       // Chiết khấu nếu không nhận cam kết thuê (%)
        maintenanceFeeRate: 2.0               // Kinh phí bảo trì (2% giá trị căn hộ trước VAT)
    },

    // 4. Tọa độ tâm dự án Eco Garden trên bản đồ tương tác (% X, % Y trên ảnh map_01.jpg)
    mapCenter: {
        x: 52.5,
        y: 62.0,
        name: "Chung cư Thương mại Eco Garden",
        subtitle: "Khu đô thị phía Nam, P. Tân Tiến (TP. Bắc Giang cũ), Tỉnh Bắc Ninh"
    }
};
