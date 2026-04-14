## I.2.1 Mục tiêu kiểm thử

Mục tiêu của ca kiểm thử này là đánh giá chức năng tìm kiếm sản phẩm theo hướng kiểm thử hộp đen bằng công cụ Playwright, tập trung vào kỹ thuật kiểm thử giá trị biên đối với trường nhập từ khóa tìm kiếm.

Cụ thể, việc kiểm thử nhằm:

- Kiểm tra phản hồi của hệ thống khi người dùng để trống từ khóa tìm kiếm.
- Kiểm tra phản hồi của hệ thống khi người dùng nhập từ khóa có độ dài tối thiểu 1 ký tự.
- Kiểm tra phản hồi của hệ thống khi người dùng nhập từ khóa có độ dài 2 ký tự, tương ứng với mức `Min + 1`.
- Kiểm tra phản hồi của hệ thống khi người dùng nhập từ khóa có độ dài `Nominal = 25`.
- Kiểm tra phản hồi của hệ thống khi người dùng nhập từ khóa có độ dài `Max - 1 = 254`.
- Kiểm tra phản hồi của hệ thống khi người dùng nhập từ khóa có độ dài `Max = 255`.
- Kiểm tra phản hồi của hệ thống khi người dùng nhập từ khóa có độ dài `Max + 1 = 256`.
- Xác nhận rằng hệ thống cập nhật đúng danh sách kết quả hiển thị sau khi thực hiện thao tác tìm kiếm.
- Ghi nhận đầy đủ minh chứng thực thi tự động thông qua ảnh chụp màn hình, video và trace.

## I.2.2 Cài đặt kiểm thử

Ca kiểm thử được cài đặt bằng **Playwright** trên trình duyệt **Chromium** và thực hiện trên môi trường triển khai trực tuyến của hệ thống. Trang được kiểm thử là chức năng tìm kiếm sản phẩm tại đường dẫn:

- `https://qlkh-tkhttt.vercel.app/dashboard/products/search`

Script kiểm thử được xây dựng trong file:

- `Tu_dong_hop_den/bien_timkiem/product-search-boundary.spec.ts`

Trong quá trình thực thi, Playwright được cấu hình để tự động lưu các minh chứng sau cho từng ca kiểm thử:

- Ảnh chụp màn hình tại thời điểm kết thúc test
- Video ghi lại toàn bộ quá trình thực thi
- File trace phục vụ việc xem lại chi tiết các bước thao tác và phản hồi của hệ thống
- HTML report tổng hợp kết quả thực thi

Các minh chứng này được lưu trong cùng thư mục:

- `E:\APP_KY2_NAM2\QLBH_TKHTTTQL\Tu_dong_hop_den\bien_timkiem\playwright-report`
- `E:\APP_KY2_NAM2\QLBH_TKHTTTQL\Tu_dong_hop_den\bien_timkiem\test-results`

## I.2.3 Ca kiểm thử

| ID | Dữ liệu đầu vào | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| TC_Search_001 | `1 ký tự` | Kiểm thử giá trị biên tối thiểu của từ khóa | Hệ thống chấp nhận từ khóa, hiển thị các sản phẩm phù hợp và giữ đúng giá trị đã nhập trong ô tìm kiếm |
| TC_Search_002 | `2 ký tự` | Kiểm thử giá trị `Min + 1` của từ khóa | Hệ thống chấp nhận từ khóa, hiển thị các sản phẩm phù hợp và giữ đúng giá trị đã nhập trong ô tìm kiếm |
| TC_Search_003 | `25 ký tự` | Kiểm thử giá trị nominal của từ khóa | Hệ thống tiếp nhận từ khóa, xử lý tìm kiếm ổn định và cập nhật vùng kết quả tương ứng |
| TC_Search_004 | `254 ký tự` | Kiểm thử giá trị `Max - 1` của từ khóa | Hệ thống tiếp nhận từ khóa, vẫn hiển thị vùng kết quả ổn định và không phát sinh lỗi giao diện |
| TC_Search_005 | `255 ký tự` | Kiểm thử giá trị `Max` của từ khóa | Hệ thống tiếp nhận từ khóa, vẫn hiển thị vùng kết quả ổn định và không phát sinh lỗi giao diện |
| TC_Search_006 | `256 ký tự` | Kiểm thử giá trị `Max + 1` của từ khóa | Theo hành vi hiện tại, hệ thống vẫn tiếp nhận từ khóa và xử lý tìm kiếm mà không phát sinh lỗi giao diện |
| TC_Search_007 | `""` | Để trống từ khóa tìm kiếm | Hệ thống vẫn hiển thị toàn bộ sản phẩm hiện có, ô tìm kiếm để trống và danh sách kết quả không bị lỗi |

## I.2.4 Kết quả thực thi

Kết quả thực thi tự động cho bộ ca kiểm thử này như sau:

- `TC_Search_007`: `PASS`
- `TC_Search_001`: `PASS`
- `TC_Search_002`: `PASS`
- `TC_Search_003`: `PASS`
- `TC_Search_004`: `PASS`
- `TC_Search_005`: `PASS`
- `TC_Search_006`: `PASS`
- Tổng số ca kiểm thử đạt: `7/7`

Kết quả trên cho thấy chức năng tìm kiếm sản phẩm xử lý ổn định đối với bảy trường hợp giá trị biên đã được lựa chọn, bao gồm để trống, mức tối thiểu, mức `Min + 1`, giá trị nominal, `Max - 1`, `Max` và `Max + 1`. Sau mỗi ca kiểm thử, hệ thống đều phản hồi ổn định, vùng kết quả hiển thị đúng trạng thái tìm kiếm và không phát sinh lỗi giao diện trong quá trình thực thi.

Đáng chú ý, ở trường hợp `TC_Search_006` với từ khóa dài `256 ký tự`, hệ thống hiện tại vẫn tiếp nhận và xử lý dữ liệu bình thường. Điều này cho thấy chức năng tìm kiếm hiện chưa áp dụng ràng buộc kiểm tra độ dài tối đa ở mức giao diện hoặc mức xử lý đầu vào.

Ngoài kết quả `PASS/FAIL`, Playwright còn cung cấp thêm các minh chứng tự động gồm ảnh chụp màn hình, video và trace cho từng ca kiểm thử. Đây là cơ sở thuận lợi để nhóm đối chiếu lại kết quả khi cần, đồng thời hỗ trợ tốt cho việc trình bày và minh họa trong báo cáo kiểm thử.
