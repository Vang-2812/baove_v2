# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN TRỊ (CMS)
## WEBSITE CÔNG TY DỊCH VỤ BẢO VỆ LONG VIỆT

> **Lưu ý quan trọng:** Tài liệu này chứa thông tin quản trị và hướng dẫn vận hành hệ thống CMS Bảo Vệ Long Việt. Vui lòng bảo mật thông tin tài khoản đăng nhập để tránh rò rỉ dữ liệu khách hàng tiềm năng.

---

## 🔐 1. HƯỚNG DẪN ĐĂNG NHẬP HỆ THỐNG

Để truy cập vào trang quản trị hệ thống, quý quản trị viên thực hiện các bước sau:

### 1.1 Thông tin truy cập
* **Đường dẫn quản trị (URL):** `https://baovelongviet.vn/admin` hoặc `https://baovelongviet.vn/admin/login`
* **Tài khoản mặc định (Đã khởi tạo):**
  * **Email:** `admin@yourdomain.vn`
  * **Mật khẩu:** `ChangeMe@2026`

> [!WARNING]
> **ĐỔI MẬT KHẨU NGAY LẬP TỨC:** Ngay trong lần đăng nhập đầu tiên, vui lòng truy cập mục **Cấu Hình** để thay đổi mật khẩu mặc định thành mật khẩu bảo mật cá nhân (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt).

### 1.2 Các bước đăng nhập
1. Nhập địa chỉ email và mật khẩu của bạn vào Form đăng nhập.
2. Click vào biểu tượng **Con Mắt** để kiểm tra tính chính xác của mật khẩu trước khi gửi.
3. Nhấp chọn nút **Đăng Nhập**. Hệ thống sẽ kiểm tra mã hóa bảo mật 2 lớp JWT và điều hướng bạn thẳng đến **Bảng điều khiển (Dashboard)**.

---

## 📊 2. BẢNG ĐIỀU KHIỂN TRUNG TÂM (DASHBOARD)

Sau khi đăng nhập thành công, bạn sẽ thấy màn hình Dashboard hiển thị toàn cảnh tình hình hoạt động của website:

* **4 Thẻ Chỉ Số Vận Hành:**
  * **Lead Hôm Nay:** Số lượng khách hàng mới gửi yêu cầu báo giá/tư vấn trong ngày.
  * **Lead Tuần Này:** Tổng số yêu cầu tư vấn nhận được trong tuần hiện tại.
  * **Hồ Sơ Ứng Tuyển Mới:** Đếm số lượng ứng viên nộp CV xin việc đang chờ duyệt.
  * **Bài Viết Đang Đăng:** Tổng số tin tức, cẩm nang và tài liệu hiện đang hiển thị công khai trên website.
* **Danh Sách Yêu Cầu Mới Nhất:** Hiển thị 7 khách hàng gửi thông tin liên hệ gần đây nhất kèm theo trạng thái xử lý trực quan.
* **Menu Thao Tác Nhanh:** Cho phép đi nhanh tới các form tạo bài viết mới, tạo tin tuyển dụng hoặc cập nhật thông tin công ty.

---

## 📈 3. QUẢN LÝ YÊU CẦU TƯ VẤN & BÁO GIÁ (LEADS)

Đây là mục quan trọng nhất giúp doanh nghiệp theo dõi, liên hệ và chuyển đổi khách hàng tiềm năng gửi yêu cầu từ website.

### 3.1 Giao diện danh sách liên hệ (`/admin/contacts`)
* **Bộ lọc trạng thái:** Bạn có thể lọc nhanh danh sách khách hàng theo 4 trạng thái:
  * 🟡 **Mới (NEW):** Yêu cầu vừa được gửi đến, chưa có nhân viên liên hệ xử lý.
  * 🔵 **Đang xử lý (IN_PROGRESS):** Nhân viên đang gọi điện tư vấn hoặc lên phương án an ninh.
  * 🟢 **Hoàn thành (DONE):** Đã ký hợp đồng hoặc xử lý xong yêu cầu của khách.
  * 🔴 **Đã hủy (CANCELLED):** Khách hàng không có nhu cầu thực tế hoặc thông tin giả mạo.
* **Thanh tìm kiếm nhanh:** Nhập Tên khách hàng, Số điện thoại hoặc Email để tìm kiếm tức thì.

### 3.2 Các bước xử lý một yêu cầu (Lead)
1. Tại bảng danh sách, nhấp chọn biểu tượng **Xem Chi Tiết (Hình con mắt)** ở cuối mỗi dòng.
2. Một **Ngăn kéo thông tin (Detail Drawer)** sẽ trượt ra từ phía bên phải màn hình hiển thị:
   * Họ tên khách hàng, Số điện thoại, Email.
   * Dịch vụ họ quan tâm, Tỉnh thành cần bảo vệ.
   * Nội dung lời nhắn chi tiết của khách hàng.
3. **Liên hệ khách hàng:** Click trực tiếp vào nút **Gọi Điện** (màu xanh lá) để thực hiện cuộc gọi nhanh nếu dùng điện thoại/máy tính có liên kết, hoặc bấm **Gửi Email** (màu xanh dương).
4. **Cập nhật trạng thái & Ghi chú nội bộ:**
   * Chọn trạng thái mới tại dropdown (ví dụ: chuyển từ *Mới* sang *Đang xử lý*).
   * Nhập tiến trình tư vấn vào ô **Ghi chú nội bộ** (ví dụ: *"Đã gọi điện hẹn ngày 20/5 khảo sát nhà xưởng"*).
   * Nhấp chọn nút **Cập Nhật Ghi Chú**. Hệ thống sẽ tự động lưu lại thời gian và thông tin người cập nhật.

---

## ✍️ 4. QUẢN LÝ BÀI VIẾT, TIN TỨC & TÀI LIỆU (CMS)

Hệ thống cho phép bạn tự viết tin tức, cẩm nang nghiệp vụ hoặc đăng tải tài liệu nội bộ lên website để phục vụ khách hàng và làm SEO.

### 4.1 Tạo bài viết mới
1. Truy cập chuyên mục **Bài Viết** trên Sidebar, chọn nút **Tạo Bài Viết**.
2. Điền các trường thông tin cơ bản:
   * **Tiêu đề bài viết:** Đặt tiêu đề hấp dẫn, chứa từ khóa SEO (Ví dụ: *"Quy trình bảo vệ nhà máy chuẩn ISO 9001"*).
   * **Đường dẫn tĩnh (Slug):** Hệ thống tự động sinh ra đường dẫn từ tiêu đề. Bạn có thể chỉnh sửa lại ngắn gọn nếu muốn.
   * **Danh mục:** Chọn đúng phân loại bài viết (Ví dụ: *Tin tức sự kiện*, *Kiến thức an ninh*, *Tài liệu nghiệp vụ*).
   * **Ảnh đại diện (Thumbnail):** Kéo thả hoặc click chọn hình ảnh đại diện sắc nét cho bài viết.
3. **Trình soạn thảo nội dung (Rich Text Editor):**
   * Sử dụng công cụ soạn thảo trực quan để định dạng chữ đậm/nhạt, tạo danh sách (bullet points), chèn bảng biểu, trích dẫn văn bản.
   * Để chèn hình ảnh minh họa bên trong nội dung, bấm chọn nút **Chèn hình ảnh** trên thanh công cụ và tải ảnh lên hệ thống.
4. **Tối ưu SEO Metadata:**
   * **Thẻ Title SEO:** Tiêu đề hiển thị trên kết quả tìm kiếm của Google (tối đa 70 ký tự).
   * **Thẻ Description SEO:** Đoạn mô tả ngắn gọn nội dung bài viết hiển thị trên Google (tối đa 160 ký tự).
5. **Đăng bài:** Chọn trạng thái **PUBLISHED (Công khai)** để bài viết xuất hiện ngay trên website, hoặc chọn **DRAFT (Nháp)** để lưu chỉnh sửa nội bộ và đăng sau. Bấm **Lưu Bài Viết**.

---

## 💼 5. QUẢN LÝ TIN TUYỂN DỤNG & DUYỆT HỒ SƠ ỨNG VIÊN

Giúp phòng Nhân sự (HR) đăng tuyển vệ sĩ/chỉ huy trưởng nhanh chóng và thu thập hồ sơ trực tuyến.

### 5.1 Đăng tin tuyển dụng mới
1. Truy cập chuyên mục **Tuyển Dụng** trên Sidebar, chọn nút **Tạo Vị Trí Tuyển Dụng**.
2. Nhập các thông tin chi tiết:
   * **Chức danh tuyển dụng:** (Ví dụ: *"Tuyển gấp 50 Vệ sĩ trực gác nhà máy tại KCN Amata"*).
   * **Thu nhập / Lương:** (Ví dụ: *"8.000.000đ - 12.000.000đ/tháng"*).
   * **Địa điểm làm việc:** (Ví dụ: *"Đồng Nai"*).
   * **Nội dung tuyển dụng:** Gồm các mục *Mô tả công việc*, *Yêu cầu tuyển chọn*, và *Quyền lợi được hưởng*. Soạn thảo trực quan bằng Rich Text Editor.
   * **Hạn nộp hồ sơ:** Đặt ngày hết hạn tuyển dụng.
3. Chọn trạng thái **OPEN (Đang tuyển)** để hiển thị lên trang Tuyển dụng của website. Bấm **Lưu Tin**.

### 5.2 Duyệt hồ sơ ứng tuyển trực tuyến
Khi ứng viên nộp hồ sơ qua biểu mẫu tuyển dụng trên website, hệ thống sẽ lưu thông tin và gửi thông báo cho HR:
1. Truy cập mục **Hồ Sơ Ứng Tuyển** trên thanh quản trị.
2. Danh sách hiển thị: Họ tên ứng viên, Số điện thoại, Email, Vị trí ứng tuyển và trạng thái hồ sơ.
3. **Tải CV ứng viên:** 
   * Tại cột Hồ sơ, nhấp vào liên kết **[Tải file CV]** (màu xanh dương). Trình duyệt sẽ tự động tải file PDF hoặc file Word CV của ứng viên về máy tính của bạn để đánh giá.
4. **Cập nhật trạng thái duyệt:**
   * Thay đổi trạng thái hồ sơ thành *Đã duyệt*, *Hẹn phỏng vấn*, hoặc *Từ chối* để dễ dàng quản lý vòng tuyển chọn.

---

## ⚙️ 6. THAY ĐỔI CẤU HÌNH HỆ THỐNG & THÔNG TIN CÔNG TY

Mục **Cấu Hình** cho phép bạn thay đổi toàn bộ thông tin hiển thị trên chân trang (Footer), trang Liên hệ và trang Giới thiệu mà không cần can thiệp vào mã nguồn:

### 6.1 Thông tin liên hệ chung
* **Số điện thoại Hotline:** Thay đổi số điện thoại khẩn cấp hiển thị trên nút gọi nhanh toàn trang.
* **Email công ty:** Địa chỉ tiếp nhận thư tư vấn của khách hàng.
* **Địa chỉ văn phòng:** Địa chỉ hiển thị ở phần bản quyền chân trang.

### 6.2 Quản lý mạng lưới chi nhánh
* Cho phép chỉnh sửa danh sách địa chỉ, hotline riêng và liên kết bản đồ Google Maps cho từng văn phòng chi nhánh (Hà Nội, TP.HCM, Đà Nẵng, Đồng Nai, Long An).
* Các cập nhật này sẽ tự động thay đổi bản đồ tương ứng trên các trang SEO địa phương của website.

---

## 🛠️ 7. HỖ TRỢ KỸ THUẬT & LIÊN HỆ BẢO HÀNH

Trong quá trình vận hành, nếu gặp sự cố kỹ thuật, lỗi không truy cập được trang quản trị hoặc muốn nâng cấp tính năng mới, quý quản trị viên vui lòng liên hệ bộ phận hỗ trợ kỹ thuật:

* **Đơn vị phát triển hệ thống:** Đội ngũ Kỹ thuật Bảo Vệ Long Việt
* **Hotline hỗ trợ 24/7:** `0923 840 999`
* **Email hỗ trợ kỹ thuật:** `tech-support@baovelongviet.vn`
* **Thời hạn hỗ trợ bảo trì miễn phí:** 12 tháng kể từ ngày bàn giao go-live chính thức.

---
*Tài liệu được biên soạn và đóng gói thành công ngày 17 tháng 05 năm 2026.*
