# Kiểm thử tự động API với Postman/Newman

Thư mục này chứa bộ kiểm thử tự động API cho hệ thống Quản lý bán hàng.

Phạm vi kiểm thử:

+ API từ chối request khi chưa đăng nhập.
+ Đăng nhập bằng tài khoản admin.
+ Kiểm tra role và trạng thái của tài khoản admin.
+ Đăng nhập bằng tài khoản nhân viên bán hàng.
+ Kiểm tra role và trạng thái của tài khoản nhân viên bán hàng.
+ Gọi API nội bộ sau khi đã xác thực.

File chính:

+ `collection/qlbh-api-security.postman_collection.json`
+ `environment/qlbh-api.postman_environment.json`
+ `reports/api-newman-report.html`
+ `reports/api-testcases-summary.csv`
+ `reports/newman-result.json`
+ `bao-cao-kiem-thu-api-postman-newman.md`

Lưu ý: mật khẩu tài khoản kiểm thử không được lưu trực tiếp trong file public. Khi chạy thực tế, mật khẩu được truyền bằng environment tạm thời hoặc biến môi trường cục bộ.

Ví dụ chạy lại bộ kiểm thử đầy đủ:

```bash
npx --yes newman run collection/qlbh-api-security.postman_collection.json -e environment/qlbh-api.postman_environment.json --env-var "admin_email=<email_admin>" --env-var "admin_password=<mat_khau_admin>" --env-var "staff_email=<email_nhan_vien_ban_hang>" --env-var "staff_password=<mat_khau_nhan_vien_ban_hang>" -r "cli,json" --reporter-json-export reports/newman-result.json
```
