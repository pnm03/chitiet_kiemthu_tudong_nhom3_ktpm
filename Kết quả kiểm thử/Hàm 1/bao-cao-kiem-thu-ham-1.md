# Báo cáo kiểm thử tự động hộp trắng - Hàm 1

## 1. Thông tin hàm kiểm thử

Tên hàm được kiểm thử: `validateStockBeforeCheckout()`

Chức năng chính của hàm là kiểm tra tồn kho trước khi cho phép thanh toán. Hàm nhận vào danh sách hóa đơn, duyệt qua các sản phẩm trong từng hóa đơn, cộng dồn tổng số lượng cần mua theo từng `product_id`, sau đó so sánh với `stock_quantity` để xác định có sản phẩm nào bị vượt quá tồn kho hay không.

Nếu tất cả sản phẩm đều đủ tồn kho, hàm trả về `true`. Nếu có ít nhất một sản phẩm không đủ tồn kho, hàm hiển thị thông báo lỗi bằng `alert()` và trả về `false`.

## 2. Mục tiêu kiểm thử

Mục tiêu kiểm thử của Hàm 1 là kiểm tra tính đúng đắn của luồng xử lý tồn kho trước khi thanh toán, cụ thể:

- Kiểm tra trường hợp không có hóa đơn.
- Kiểm tra trường hợp hóa đơn không có sản phẩm.
- Kiểm tra trường hợp một sản phẩm đủ tồn kho.
- Kiểm tra trường hợp nhiều dòng sản phẩm có cùng `product_id` được cộng dồn chính xác.
- Kiểm tra trường hợp nhiều hóa đơn đều đủ tồn kho.
- Kiểm tra trường hợp sản phẩm không đủ tồn kho.
- Kiểm tra trường hợp lỗi tồn kho xuất hiện ở sản phẩm trong cùng hóa đơn.
- Kiểm tra trường hợp lỗi tồn kho xuất hiện ở hóa đơn phía sau.
- Kiểm tra nhánh ẩn khi `product.quantity` không được truyền vào nên lấy mặc định là `1`.
- Kiểm tra nhánh ẩn khi `product.stock_quantity` bằng `null` nên lấy mặc định là `0`.

Ban đầu, nhóm xây dựng bộ kiểm thử gồm 8 ca kiểm thử từ B1 đến B8. Bộ này bao phủ các luồng điều khiển chính của hàm. Sau khi chạy kiểm thử tự động lần 1, kết quả cho thấy các câu lệnh đã được thực thi đầy đủ, nhưng độ bao phủ nhánh mới đạt 80%. Vì vậy, nhóm kết luận bộ kiểm thử lần 1 mới đạt C1.

Sau đó, nhóm phân tích lại mã nguồn và nhận thấy trong hàm có 2 biểu thức tạo nhánh ẩn:

- `const quantity = product.quantity || 1`
- `const stockQuantity = product.stock_quantity || 0`

Hai biểu thức trên tạo ra các trường hợp xử lý khác nhau: lấy giá trị thực tế nếu có dữ liệu, hoặc lấy giá trị mặc định nếu dữ liệu bị thiếu/null. Vì vậy, nhóm bổ sung thêm B9 và B10 để bao phủ các nhánh này. Sau khi chạy kiểm thử lần 2, kết quả đạt 100% ở cả Statements, Branches, Functions và Lines, nên có thể kết luận Hàm 1 đạt C2/C3.

## 3. Cài đặt kiểm thử

### 3.1. Mã code

File mã nguồn của hàm:

[validateStockBeforeCheckout.ts](https://github.com/pnm03/chitiet_kiemthu_tudong_nhom3_ktpm/blob/main/H%C3%A0m%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%201/validateStockBeforeCheckout.ts)

### 3.2. Mã kiểm thử

Nhóm tách mã kiểm thử thành 2 file để thể hiện rõ 2 lần chạy:

- Lần 1: [validateStockBeforeCheckout.C1.test.ts](https://github.com/pnm03/chitiet_kiemthu_tudong_nhom3_ktpm/blob/main/M%C3%A3%20c%C3%A0i%20%C4%91%E1%BA%B7t%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%201/validateStockBeforeCheckout.C1.test.ts)
- Lần 2: [validateStockBeforeCheckout.C2-C3.test.ts](https://github.com/pnm03/chitiet_kiemthu_tudong_nhom3_ktpm/blob/main/M%C3%A3%20c%C3%A0i%20%C4%91%E1%BA%B7t%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%201/validateStockBeforeCheckout.C2-C3.test.ts)

File kiểm thử lần 1 chỉ chứa 8 ca kiểm thử ban đầu, dùng để kiểm tra mức C1. File kiểm thử lần 2 chứa đầy đủ 10 ca kiểm thử, trong đó B9 và B10 được bổ sung để bao phủ các nhánh ẩn.

### 3.3. Lệnh chạy kiểm thử

Lệnh chạy lần 1:

```bash
npx jest TEST_1/Ham_1/validateStockBeforeCheckout.C1.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_1/stock-validation.ts --coverageDirectory=TEST_1/Ham_1/ket-qua-lan-1/coverage --json --outputFile=TEST_1/Ham_1/ket-qua-lan-1/jest-result.json
```

Lệnh chạy lần 2:

```bash
npx jest TEST_1/Ham_1/validateStockBeforeCheckout.C2-C3.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_1/stock-validation.ts --coverageDirectory=TEST_1/Ham_1/ket-qua-lan-2/coverage --json --outputFile=TEST_1/Ham_1/ket-qua-lan-2/jest-result.json
```

## 4. Ca kiểm thử

### 4.1. Bộ ca kiểm thử lần 1 - kiểm tra C1

| ID | Dữ liệu đầu vào | Mục đích kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| B1 | `[]` | Kiểm tra trường hợp không có hóa đơn | Hàm trả về `true` |
| B2 | `[{ products: [] }]` | Kiểm tra hóa đơn tồn tại nhưng không có sản phẩm | Hàm trả về `true` |
| B3 | Một sản phẩm A, `quantity = 2`, `stock_quantity = 5` | Kiểm tra sản phẩm đủ tồn kho | Hàm trả về `true` |
| B4 | Hai sản phẩm cùng `product_id = A`, số lượng lần lượt là 2 và 1, tồn kho là 5 | Kiểm tra cộng dồn số lượng theo cùng `product_id` | Hàm trả về `true` |
| B5 | Hai hóa đơn, sản phẩm A đủ tồn kho và sản phẩm B đủ tồn kho | Kiểm tra nhiều hóa đơn đều hợp lệ | Hàm trả về `true` |
| B6 | Một sản phẩm A, `quantity = 2`, `stock_quantity = 1` | Kiểm tra sản phẩm đầu tiên bị thiếu tồn kho | Hàm trả về `false` và gọi `alert()` |
| B7 | Một hóa đơn có sản phẩm A đủ tồn kho và sản phẩm B thiếu tồn kho | Kiểm tra lỗi tồn kho trong cùng hóa đơn | Hàm trả về `false` và gọi `alert()` |
| B8 | Hai hóa đơn, hóa đơn sau có sản phẩm B thiếu tồn kho | Kiểm tra lỗi tồn kho phát sinh ở hóa đơn phía sau | Hàm trả về `false` và gọi `alert()` |

### 4.2. Đánh giá sau lần chạy 1

Sau khi chạy 8 ca kiểm thử ban đầu, toàn bộ test đều pass. Tuy nhiên, kết quả coverage cho thấy:

- Statements: 100%
- Branches: 80%
- Functions: 100%
- Lines: 100%

Điều này cho thấy các câu lệnh chính đã được thực thi, nhưng chưa bao phủ toàn bộ nhánh. Các nhánh chưa được bao phủ nằm tại những biểu thức có toán tử `||`, cụ thể là dòng xử lý `quantity` và `stockQuantity`. Do đó, nhóm kết luận bộ kiểm thử lần 1 mới đạt C1.

### 4.3. Bộ ca kiểm thử lần 2 - bổ sung để đạt C2/C3

Ở lần chạy 2, nhóm giữ lại B1 đến B8 và bổ sung thêm 2 ca kiểm thử:

| ID | Dữ liệu đầu vào | Mục đích kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| B9 | Sản phẩm A không truyền `quantity`, `stock_quantity = 5` | Kiểm tra nhánh lấy mặc định `quantity = 1` | Hàm trả về `true` |
| B10 | Sản phẩm A có `quantity = 2`, `stock_quantity = null` | Kiểm tra nhánh lấy mặc định `stockQuantity = 0` | Hàm trả về `false` và gọi `alert()` |

B9 dùng để kiểm tra biểu thức `product.quantity || 1`. Khi `product.quantity` không tồn tại, hàm phải lấy giá trị mặc định là `1`.

B10 dùng để kiểm tra biểu thức `product.stock_quantity || 0`. Khi `stock_quantity = null`, hàm phải lấy giá trị mặc định là `0`, từ đó phát sinh lỗi thiếu tồn kho.

## 5. Kết quả kiểm thử

### 5.1. Kết quả lần chạy 1

File kết quả:

- [bao-cao-ket-qua.html](./Lần%201%20-%20C1/bao-cao-ket-qua.html)
- [ket-qua-lan-1-C1.md](./Lần%201%20-%20C1/ket-qua-lan-1-C1.md)
- [coverage-html/index.html](./Lần%201%20-%20C1/coverage-html/index.html)
- [coverage-html/stock-validation.ts.html](./Lần%201%20-%20C1/coverage-html/stock-validation.ts.html)
- [jest-result.json](./Lần%201%20-%20C1/jest-result.json)
- [coverage-final.json](./Lần%201%20-%20C1/coverage-final.json)

Kết quả lần 1:

| Chỉ tiêu | Kết quả |
|---|---|
| Test Suites | 1 passed, 1 total |
| Tests | 8 passed, 8 total |
| Statements | 100% |
| Branches | 80% |
| Functions | 100% |
| Lines | 100% |
| Kết luận | Đạt C1, chưa đạt C2/C3 |

Kết luận lần 1: Bộ kiểm thử ban đầu đã thực thi đầy đủ các câu lệnh chính trong hàm nên đạt C1. Tuy nhiên, do Branches mới đạt 80%, bộ kiểm thử chưa bao phủ hết các nhánh ẩn trong biểu thức nên chưa đủ cơ sở kết luận đạt C2/C3.

### 5.2. Kết quả lần chạy 2

File kết quả:

- [bao-cao-ket-qua.html](./Lần%202%20-%20C2-C3/bao-cao-ket-qua.html)
- [ket-qua-lan-2-C2-C3.md](./Lần%202%20-%20C2-C3/ket-qua-lan-2-C2-C3.md)
- [coverage-html/index.html](./Lần%202%20-%20C2-C3/coverage-html/index.html)
- [coverage-html/stock-validation.ts.html](./Lần%202%20-%20C2-C3/coverage-html/stock-validation.ts.html)
- [jest-result.json](./Lần%202%20-%20C2-C3/jest-result.json)
- [coverage-final.json](./Lần%202%20-%20C2-C3/coverage-final.json)

Kết quả lần 2:

| Chỉ tiêu | Kết quả |
|---|---|
| Test Suites | 1 passed, 1 total |
| Tests | 10 passed, 10 total |
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |
| Kết luận | Đạt C2/C3 |

Kết luận lần 2: Sau khi bổ sung B9 và B10, bộ kiểm thử đã bao phủ đầy đủ các câu lệnh, các nhánh điều khiển và các nhánh ẩn trong biểu thức. Vì vậy, có thể kết luận Hàm 1 `validateStockBeforeCheckout()` đạt C2/C3.
