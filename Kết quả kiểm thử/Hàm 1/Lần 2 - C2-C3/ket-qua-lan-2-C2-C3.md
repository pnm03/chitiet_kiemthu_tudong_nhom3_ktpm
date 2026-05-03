# Kết quả kiểm thử Hàm 1 - Lần 2 - C2/C3

## Lệnh chạy

```bash
npx jest TEST_1/Ham_1/validateStockBeforeCheckout.C2-C3.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_1/stock-validation.ts --coverageDirectory=TEST_1/Ham_1/ket-qua-lan-2/coverage --json --outputFile=TEST_1/Ham_1/ket-qua-lan-2/jest-result.json
```

## Kết quả thực thi

| Chỉ tiêu | Kết quả |
|---|---|
| Test Suites | 1 passed, 1 total |
| Tests | 10 passed, 10 total |
| Snapshots | 0 total |
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |
| Uncovered branch lines | Không có |

## Nhận xét

Lần chạy 2 sử dụng 10 ca kiểm thử từ B1 đến B10. Trong đó B9 và B10 được bổ sung để kiểm tra các nhánh ẩn:

- B9 kiểm tra trường hợp không truyền `quantity`, khi đó hàm lấy mặc định `quantity = 1`.
- B10 kiểm tra trường hợp `stock_quantity = null`, khi đó hàm lấy mặc định `stockQuantity = 0`.

Sau khi bổ sung 2 ca kiểm thử này, Branches đạt 100%. Vì vậy, kết luận lần chạy 2 là Hàm 1 đạt C2/C3.
