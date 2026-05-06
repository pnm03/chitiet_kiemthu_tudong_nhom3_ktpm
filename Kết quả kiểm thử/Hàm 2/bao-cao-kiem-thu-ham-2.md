# Báo cáo kiểm thử tự động hộp trắng - Hàm 2

## VIII.3.1 Mục tiêu kiểm thử

Mục tiêu kiểm thử của Hàm 2 `handleInputChange()` là kiểm tra chức năng xử lý thay đổi dữ liệu nhập trên form nhân viên. Hàm nhận sự kiện thay đổi từ ô nhập liệu, đọc các giá trị `name`, `value`, `type`, sau đó cập nhật lại `formData` theo từng loại trường dữ liệu.

Các trường hợp xử lý chính gồm: nhập lương, nhập ngày kết thúc, chọn tài khoản người dùng, chọn người quản lý trực tiếp, tự động xác định chi nhánh theo người quản lý, và cập nhật các trường thông thường như họ tên.

Em chia quá trình kiểm thử thành 3 lần chạy. Lần 1 dùng 8 ca kiểm thử ban đầu để kiểm tra các luồng xử lý chính và đánh giá C1. Lần 2 bổ sung thêm các ca kiểm thử cho nhánh ẩn trong biểu thức gán giá trị, từ đó đánh giá C2. Lần 3 bổ sung thêm các ca kiểm thử cho điều kiện con trong biểu thức điều kiện ghép, từ đó đánh giá C3.

## VIII.3.2 Cài đặt kiểm thử

Mã nguồn của hàm:

[handleInputChange.ts](../../H%C3%A0m%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%202/handleInputChange.ts)

Mã kiểm thử được tách thành 3 file:

- [handleInputChange.C1.test.ts](../../M%C3%A3%20c%C3%A0i%20%C4%91%E1%BA%B7t%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%202/handleInputChange.C1.test.ts)
- [handleInputChange.C2.test.ts](../../M%C3%A3%20c%C3%A0i%20%C4%91%E1%BA%B7t%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%202/handleInputChange.C2.test.ts)
- [handleInputChange.C3.test.ts](../../M%C3%A3%20c%C3%A0i%20%C4%91%E1%BA%B7t%20ki%E1%BB%83m%20th%E1%BB%AD/H%C3%A0m%202/handleInputChange.C3.test.ts)

Trong file kiểm thử, em tạo hàm hỗ trợ `executeHandleInputChange()` để giả lập sự kiện nhập liệu, truyền dữ liệu `branches`, `managers`, đồng thời giả lập `setFormData` bằng `jest.fn()`. Sau khi gọi hàm, em kiểm tra `setFormData` có được gọi đúng một lần hay không và trạng thái mới `nextState` có khớp với kết quả mong đợi hay không.

Lệnh chạy lần 1:

```bash
npx jest TEST_1/Ham_2/handleInputChange.C1.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_2/staff-handle-input-change.ts --coverageDirectory=TEST_1/Ham_2/ket-qua-lan-1/coverage --json --outputFile=TEST_1/Ham_2/ket-qua-lan-1/jest-result.json
```

Lệnh chạy lần 2:

```bash
npx jest TEST_1/Ham_2/handleInputChange.C2.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_2/staff-handle-input-change.ts --coverageDirectory=TEST_1/Ham_2/ket-qua-lan-2/coverage --json --outputFile=TEST_1/Ham_2/ket-qua-lan-2/jest-result.json
```

Lệnh chạy lần 3:

```bash
npx jest TEST_1/Ham_2/handleInputChange.C3.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_2/staff-handle-input-change.ts --coverageDirectory=TEST_1/Ham_2/ket-qua-lan-3/coverage --json --outputFile=TEST_1/Ham_2/ket-qua-lan-3/jest-result.json
```

## VIII.3.3 Ca kiểm thử

### Bộ ca kiểm thử lần 1 - C1

| ID | Dữ liệu kiểm thử | Mục đích kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| B1 | `name = salary`, `value = 12a3` | Kiểm tra lọc ký tự không phải số và cập nhật lương | `salary = 123` |
| B2 | `name = end_date`, `value = ''` | Kiểm tra ngày kết thúc rỗng | `end_date = null` |
| B3 | `name = user_id`, `value = ''` | Kiểm tra tài khoản người dùng rỗng | `user_id = null` |
| B4 | `name = reports_to_user_id`, `value = ''` | Kiểm tra xóa người quản lý và chi nhánh | `reports_to_user_id = null`, `branch_id = null` |
| B5 | Người quản lý M01 có branch trực tiếp B01 | Kiểm tra lấy chi nhánh từ `manager.branch` | `reports_to_user_id = M01`, `branch_id = B01` |
| B6 | Người quản lý M02 không có branch trực tiếp nhưng có branch phụ trách B02 | Kiểm tra lấy chi nhánh từ bảng `branches` | `reports_to_user_id = M02`, `branch_id = B02` |
| B7 | Người quản lý M03 không có branch phù hợp | Kiểm tra trường hợp không xác định được chi nhánh | `reports_to_user_id = M03`, `branch_id = null` |
| B8 | `name = full_name`, `value = Nguyen Van A` | Kiểm tra cập nhật trường thông thường | `full_name = Nguyen Van A` |

### Bộ ca kiểm thử lần 2 - C2

Ở lần 2, em giữ lại B1 đến B8 và bổ sung:

| ID | Dữ liệu kiểm thử | Mục đích kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| B9 | `name = salary`, `value = ''` | Kiểm tra nhánh `numericValue ? parseInt(...) : 0` khi không có số | `salary = 0` |
| B10 | `name = user_id`, `value = U01` | Kiểm tra nhánh `value === '' ? null : value` khi có giá trị | `user_id = U01` |

### Bộ ca kiểm thử lần 3 - C3

Ở lần 3, em giữ lại B1 đến B10 và bổ sung:

| ID | Dữ liệu kiểm thử | Mục đích kiểm thử | Kết quả mong đợi |
|---|---|---|---|
| B11 | `name = end_date`, `value = 2026-05-07` | Kiểm tra điều kiện con `name === 'end_date'` đúng nhưng `value === ''` sai | `end_date = 2026-05-07` |
| B12 | `reports_to_user_id = M04`, không tìm thấy manager và branch | Kiểm tra điều kiện con `manager` trong `manager && manager.branch` là sai | `reports_to_user_id = M04`, `branch_id = null` |

## VIII.3.4 Kết quả kiểm thử

### Lần chạy 1

- [Báo cáo HTML lần 1](./Lần%201%20-%20C1/bao-cao-ket-qua.html)
- [Kết quả Markdown lần 1](./Lần%201%20-%20C1/ket-qua-lan-1-C1.md)
- [Coverage HTML lần 1](./Lần%201%20-%20C1/coverage-html/index.html)

Kết quả lần 1: 8/8 test pass, Statements 100% (22/22), Branches 90.9% (20/22), Functions 100% (12/12), Lines 100% (22/22). Em kết luận Hàm 2 mới đạt C1.

### Lần chạy 2

- [Báo cáo HTML lần 2](./Lần%202%20-%20C2/bao-cao-ket-qua.html)
- [Kết quả Markdown lần 2](./Lần%202%20-%20C2/ket-qua-lan-2-C2.md)
- [Coverage HTML lần 2](./Lần%202%20-%20C2/coverage-html/index.html)

Kết quả lần 2: 10/10 test pass, Statements 100% (22/22), Branches 100% (22/22), Functions 100% (12/12), Lines 100% (22/22). Em kết luận Hàm 2 đạt C2.

### Lần chạy 3

- [Báo cáo HTML lần 3](./Lần%203%20-%20C3/bao-cao-ket-qua.html)
- [Kết quả Markdown lần 3](./Lần%203%20-%20C3/ket-qua-lan-3-C3.md)
- [Coverage HTML lần 3](./Lần%203%20-%20C3/coverage-html/index.html)

Kết quả lần 3: 12/12 test pass, Statements 100% (22/22), Branches 100% (22/22), Functions 100% (12/12), Lines 100% (22/22). Sau khi bổ sung thêm các ca kiểm thử cho điều kiện con, em kết luận Hàm 2 đạt C3.
