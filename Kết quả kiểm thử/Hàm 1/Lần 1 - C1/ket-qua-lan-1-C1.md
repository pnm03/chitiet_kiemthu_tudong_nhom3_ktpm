# Kết quả kiểm thử Hàm 1 - Lần 1 - C1

## Lệnh chạy

```bash
npx jest TEST_1/Ham_1/validateStockBeforeCheckout.C1.test.ts --coverage --collectCoverageFrom=TEST_1/Ham_1/stock-validation.ts --coverageDirectory=TEST_1/Ham_1/ket-qua-lan-1/coverage --json --outputFile=TEST_1/Ham_1/ket-qua-lan-1/jest-result.json
```

## Kết quả thực thi

| Chỉ tiêu | Kết quả |
|---|---|
| Test Suites | 1 passed, 1 total |
| Tests | 8 passed, 8 total |
| Snapshots | 0 total |
| Statements | 100% |
| Branches | 80% |
| Functions | 100% |
| Lines | 100% |
| Uncovered branch lines | 20, 38 |

## Nhận xét

Lần chạy 1 sử dụng 8 ca kiểm thử từ B1 đến B8. Các ca kiểm thử đều pass, chứng tỏ các luồng xử lý chính của hàm đã được kiểm tra.

Tuy nhiên, Branches mới đạt 80%. Hai nhánh chưa được bao phủ nằm ở các biểu thức có toán tử `||`:

- `const quantity = product.quantity || 1`
- `const stockQuantity = product.stock_quantity || 0`

Vì vậy, kết luận lần chạy 1 là hàm mới đạt C1, chưa đạt C2/C3.
