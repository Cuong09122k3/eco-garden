# HƯỚNG DẪN ĐƯA WEBSITE LÊN INTERNET & CẤU HÌNH NƠI LƯU TRỮ FORM KHÁCH HÀNG (CRM + EMAIL)

Toàn bộ mã nguồn Website **Chung cư Thương mại Eco Garden** tại thư mục `e:\web` được thiết kế theo kiến trúc **Static Web App chuẩn hóa** (không phụ thuộc máy chủ phức tạp), giúp bạn đưa lên mạng Internet miễn phí 100% chỉ trong **1 phút** để bất kỳ ai cũng truy cập được trên điện thoại và máy tính.

---

## PHẦN 1: LÀM SAO ĐỂ BẤT KỲ AI CŨNG TRUY CẬP ĐƯỢC WEBSITE?

Bạn có thể chọn **1 trong 2 cách miễn phí vĩnh viễn** dưới đây:

### Cách 1: Kéo - Thả trực tiếp lên Netlify Drop (Nhanh nhất - Chỉ mất 30 giây)
1. Truy cập trang chủ **[https://app.netlify.com/drop](https://app.netlify.com/drop)** (Đăng nhập nhanh bằng tài khoản Google hoặc GitHub).
2. Mở ổ đĩa máy tính, kéo nguyên thư mục **`e:\web`** thả vào ô **"Drag and drop your site output folder here"** trên trình duyệt.
3. Ngay lập tức, Netlify sẽ cấp cho bạn một đường link công khai có dạng `https://eco-garden-bacninh.netlify.app` (bạn có thể đổi tên miền phụ tùy ý trong mục *Site configuration -> Change site name* hoặc trỏ tên miền riêng `.vn` / `.com` vào).
4. Gửi đường link này qua Zalo, Facebook hoặc chạy Quảng cáo (Google Ads / Facebook Ads) để khách hàng trên toàn quốc truy cập.

### Cách 2: Đưa lên Vercel hoặc Cloudflare Pages
1. Cài đặt công cụ dòng lệnh (nếu muốn đẩy trực tiếp từ máy) hoặc tải thư mục `e:\web` lên GitHub.
2. Kết nối với **[Vercel.com](https://vercel.com)** hoặc **[Pages.cloudflare.com](https://pages.cloudflare.com)** để nhận đường link tốc độ cao toàn cầu.

---

## PHẦN 2: CẤU HÌNH 3 LỚP LƯU TRỮ DỮ LIỆU KHÁCH HÀNG ĐIỀN FORM (NGOÀI GỬI VỀ EMAIL)

Hệ thống đã được lập trình sẵn **3 cơ chế lưu trữ và thông báo song song** trong file [`js/config.js`](file:///e:/web/js/config.js) và [`js/app.js`](file:///e:/web/js/app.js):

### Lớp 1: Lưu trữ tập trung trên Google Sheets (Đóng vai trò là phần mềm CRM Online miễn phí) + Gửi Email tự động
Khi khách hàng điền form từ bất kỳ điện thoại/máy tính nào, dữ liệu sẽ tự động nhảy vào bảng tính **Google Sheets** của bạn theo thời gian thực VÀ gửi thông báo về Gmail:
1. Mở một file Google Trang tính mới tại: **[https://sheets.new](https://sheets.new)** và đặt tên là `CRM Khách Hàng Eco Garden`.
2. Trên thanh công cụ, chọn **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
3. Mở file [`google_apps_script_crm.js`](file:///e:/web/google_apps_script_crm.js) trong thư mục `e:\web`, copy toàn bộ nội dung dán vào cửa sổ Apps Script (nhớ điền email thật của bạn vào dòng `const NOTIFICATION_EMAIL = "xxxxxx@gmail.com";`).
4. Bấm nút **Triển khai (Deploy)** -> **Tùy chọn triển khai mới (New deployment)**:
   - Chọn loại: **Ứng dụng web (Web app)**.
   - Quyền truy cập: Chọn **Bất kỳ ai (Anyone)**.
   - Bấm **Triển khai** và copy đường dẫn **Web App URL** (`https://script.google.com/macros/s/.../exec`).
5. Mở file [`js/config.js`](file:///e:/web/js/config.js), dán đường dẫn vừa copy vào dòng:
   ```javascript
   googleSheetWebhookUrl: "https://script.google.com/macros/s/....../exec",
   ```

### Lớp 2: Gửi thẳng về Email `xxxxxx@gmail.com` không cần cài đặt Server
Trong file [`js/config.js`](file:///e:/web/js/config.js), bạn chỉ cần thay dòng:
```javascript
targetEmail: "xxxxxx@gmail.com",
```
bằng địa chỉ Gmail thật của bạn (ví dụ: `kinhdoanh.ecogarden@gmail.com`). Ngay lần đầu tiên có khách điền form, dịch vụ FormSubmit sẽ gửi 1 email xác nhận (Activate) tới hộp thư của bạn; bạn chỉ cần bấm nút **Activate** trong mail đó 1 lần duy nhất là mọi form sau đều đổ thẳng về hộp thư.

### Lớp 3: Kho Lưu Trữ Quản Trị Khách Hàng (Admin CRM) ngay trên Website + Xuất file Excel (`.CSV`)
- Ở cuối trang web (Footer), có nút **"🔐 Mở Kho Lưu Trữ Khách Hàng (CRM)"**.
- Nhập mã PIN mặc định: **`2026`** (có thể đổi trong [`js/config.js`](file:///e:/web/js/config.js)).
- Tại đây bạn có thể xem danh sách khách hàng đã đăng ký trên thiết bị, cập nhật trạng thái chăm sóc (*Mới đăng ký*, *Đã gọi tư vấn*, *Hẹn xem thực tế*, *Đã đặt cọc*) và bấm nút **"📥 Xuất File Excel (.CSV)"** để tải bảng tổng hợp tiếng Việt chuẩn font về máy.

