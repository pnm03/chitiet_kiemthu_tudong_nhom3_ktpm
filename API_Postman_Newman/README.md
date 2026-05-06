# Kiểm thử tự động API với Postman/Newman

Thư mục này chứa collection, environment và kết quả kiểm thử tự động API cho hệ thống quản lý bán hàng.

## Lệnh chạy

```bash
npx --yes newman run collection/qlbh-api-security.postman_collection.json -e environment/qlbh-api.postman_environment.json -r cli,json --reporter-json-export reports/newman-result.json
```

## Nội dung kiểm thử

Bộ kiểm thử tập trung vào việc xác minh các API nội bộ từ chối request khi chưa có session đăng nhập.

## File chính

- `collection/qlbh-api-security.postman_collection.json`: Postman Collection.
- `environment/qlbh-api.postman_environment.json`: Postman Environment.
- `reports/newman-result.json`: kết quả chạy Newman dạng JSON.
- `reports/api-newman-report.html`: báo cáo HTML tổng hợp.
