# Kết quả kiểm thử Hàm 2 - Lần 2 - C2

## Lệnh chạy

```bash
npx jest TEST_1/Ham_2/handleInputChange.C2.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_2/staff-handle-input-change.ts --coverageDirectory=TEST_1/Ham_2/ket-qua-lan-2/coverage --json --outputFile=TEST_1/Ham_2/ket-qua-lan-2/jest-result.json
```

## Kết quả thực thi

| Chỉ tiêu | Kết quả |
|---|---|
| Test Suites | 1 passed, 1 total |
| Tests | 10 passed, 10 total |
| Statements | 100% (22/22) |
| Branches | 100% (22/22) |
| Functions | 100% (12/12) |
| Lines | 100% (22/22) |
| Uncovered branch lines | Không có |

## Kết luận

Sau khi bổ sung B9 và B10, bộ kiểm thử đã bao phủ thêm các nhánh xử lý giá trị rỗng và giá trị có dữ liệu trong các biểu thức gán giá trị. Kết quả cho thấy Branches đạt 100%, vì vậy ở lần chạy 2 em kết luận Hàm 2 đạt C2.
