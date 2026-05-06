# Báo cáo kiểm thử tự động hộp trắng - Hàm 3

## VIII.4.1 Mục tiêu kiểm thử

Mục tiêu kiểm thử của Hàm 3 `deleteInvoice()` là kiểm tra chức năng xóa hóa đơn đang tạo trong giao diện bán hàng. Hàm nhận vào vị trí hóa đơn cần xóa, sự kiện click và các hàm cập nhật trạng thái liên quan.

Hàm cần bảo đảm các yêu cầu chính sau:

- Luôn gọi `event.stopPropagation()` để ngăn sự kiện click lan ra ngoài.
- Không cho phép xóa hóa đơn cuối cùng trong danh sách.
- Khi xóa hóa đơn đang được chọn, chỉ số hóa đơn đang hoạt động được đặt lại về `0`.
- Khi xóa hóa đơn đứng trước hóa đơn đang hoạt động, chỉ số hóa đơn đang hoạt động được giảm đi `1`.
- Khi xóa hóa đơn đứng sau hóa đơn đang hoạt động, chỉ số hóa đơn đang hoạt động được giữ nguyên.
- Sau khi xóa hóa đơn hợp lệ, lỗi số lượng sản phẩm được xóa về trạng thái rỗng.

Khác với Hàm 1 và Hàm 2, Hàm 3 không có biểu thức tạo nhánh ẩn như `||`, toán tử ba ngôi, hoặc điều kiện ghép phức tạp cần tách thêm. Vì vậy, em chỉ cần xây dựng một bộ ca kiểm thử duy nhất để bao phủ đầy đủ các nhánh điều khiển của hàm.

## VIII.4.2 Ca kiểm thử

| ID | Dữ liệu kiểm thử | Mục đích kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| B1 | Danh sách chỉ có 1 hóa đơn, `index = 0`, `activeInvoiceIndex = 0` | Kiểm tra không cho xóa hóa đơn cuối cùng | Gọi `alert()`, không gọi `setInvoices`, không gọi `setActiveInvoiceIndex`, không gọi `setQuantityErrors` |
| B2 | Danh sách có 3 hóa đơn, xóa hóa đơn tại `index = 1`, `activeInvoiceIndex = 1` | Kiểm tra xóa hóa đơn đang được chọn | Gọi `setInvoices()` với danh sách đã xóa và gọi `setActiveInvoiceIndex(0)` |
| B3 | Danh sách có 3 hóa đơn, xóa hóa đơn tại `index = 0`, `activeInvoiceIndex = 2` | Kiểm tra xóa hóa đơn đứng trước hóa đơn đang hoạt động | Gọi `setInvoices()` với danh sách đã xóa và gọi `setActiveInvoiceIndex(1)` |
| B4 | Danh sách có 3 hóa đơn, xóa hóa đơn tại `index = 2`, `activeInvoiceIndex = 0` | Kiểm tra xóa hóa đơn đứng sau hóa đơn đang hoạt động | Gọi `setInvoices()` với danh sách đã xóa, không gọi `setActiveInvoiceIndex()` |

## VIII.4.3 Cài đặt kiểm thử

Mã nguồn của hàm:

[deleteInvoice.ts](../../H%C3%A0m%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%203/deleteInvoice.ts)

Mã kiểm thử:

[deleteInvoice.test.ts](../../M%C3%A3%20c%C3%A0i%20%C4%91%E1%BA%B7t%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%203/deleteInvoice.test.ts)

Trong file kiểm thử, em tạo hàm hỗ trợ `executeDeleteInvoice()` để giả lập dữ liệu đầu vào và các hàm cập nhật trạng thái như `setInvoices`, `setActiveInvoiceIndex`, `setQuantityErrors`. Các hàm này được giả lập bằng `jest.fn()` để kiểm tra xem hàm `deleteInvoice()` có gọi đúng hàm, đúng số lần và đúng dữ liệu hay không.

Vì trong hàm có sử dụng `alert()` khi người dùng cố xóa hóa đơn cuối cùng, em dùng `jest.spyOn(window, 'alert')` để giả lập hộp thoại thông báo. Cách này giúp kiểm tra được nội dung alert mà không làm bật hộp thoại thật trong quá trình chạy kiểm thử tự động.

Lệnh chạy kiểm thử:

```bash
npx jest TEST_1/Ham_3/delete-invoice.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_3/delete-invoice.ts --coverageDirectory=TEST_1/Ham_3/ket-qua/coverage --json --outputFile=TEST_1/Ham_3/ket-qua/jest-result.json
```

## VIII.4.4 Kết quả kiểm thử

File kết quả:

- [Báo cáo HTML](./Lần%201%20-%20C1-C2-C3/bao-cao-ket-qua.html)
- [Kết quả Markdown](./Lần%201%20-%20C1-C2-C3/ket-qua-ham-3.md)
- [Coverage HTML](./Lần%201%20-%20C1-C2-C3/coverage-html/index.html)
- [Coverage theo dòng code](./Lần%201%20-%20C1-C2-C3/coverage-html/delete-invoice.ts.html)

Kết luận kết quả như sau:

	4/4 test pass
	Statements: 100% (13/13)
	Branches: 100% (6/6)
	Functions: 100% (1/1)
	Lines: 100% (13/13)

Kết quả này cho thấy toàn bộ các câu lệnh, các nhánh rẽ, hàm và dòng mã có thể thực thi trong phạm vi của hàm đều đã được bao phủ bởi bộ kiểm thử. Hàm `deleteInvoice()` không có nhánh ẩn hoặc điều kiện ghép cần tách thêm. Vì vậy, có thể kết luận rằng Hàm 3 đã đạt C1, C2 và C3.
