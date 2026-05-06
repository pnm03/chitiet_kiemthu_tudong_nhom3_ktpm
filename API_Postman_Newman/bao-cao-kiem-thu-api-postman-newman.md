# IX.2 Thiết kế ca kiểm thử tự động API với Postman/Newman

Trong phần kiểm thử tự động API, em lựa chọn kiểm tra một số API của hệ thống Quản lý bán hàng trên môi trường deploy:

https://qlkh-tkhttt.vercel.app

Sau khi kiểm thử các API ở trạng thái chưa đăng nhập, em tiếp tục mở rộng bộ kiểm thử để kiểm tra trường hợp người dùng đã đăng nhập. Cụ thể, em kiểm thử với 2 loại tài khoản đại diện:

+ Tài khoản admin.
+ Tài khoản nhân viên bán hàng.

Mục tiêu của phần này là kiểm tra hệ thống có phân biệt đúng trạng thái chưa đăng nhập và đã đăng nhập hay không. Với request chưa đăng nhập, hệ thống phải từ chối truy cập. Với request đã đăng nhập, hệ thống phải cho phép truy cập API nội bộ phù hợp và trả về dữ liệu đúng.

Bộ kiểm thử được thiết kế bằng Postman Collection. Sau đó, collection được chạy tự động bằng Newman để tạo kết quả kiểm thử dạng JSON, CSV và HTML.

## Bảng thiết kế ca kiểm thử API

| ID | API kiểm thử | Method | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|---|---|
| API_001 | /api/categories | GET | Không gửi cookie/session/token đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_002 | /api/categories | POST | Không gửi cookie/session/token, body thiếu name_category và description_category | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_003 | /api/check-tables | GET | Không gửi cookie/session/token đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_004 | /api/partners/returns | GET | Không gửi cookie/session/token đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_005 | /api/partners/returns | POST | Không gửi cookie/session/token, body thiếu dữ liệu đổi trả | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_006 | /auth/v1/token?grant_type=password | POST | Email và mật khẩu của tài khoản admin | Đăng nhập thành công, trả về access_token và đúng email admin |
| API_007 | /rest/v1/accounts | GET | Bearer token của admin | Trả về thông tin tài khoản, role = admin và status = active |
| API_008 | /api/check-tables | GET | Bearer token của admin | Trả về 200 OK, response JSON có success = true |
| API_009 | /auth/v1/token?grant_type=password | POST | Email và mật khẩu của tài khoản nhân viên bán hàng | Đăng nhập thành công, trả về access_token và đúng email nhân viên bán hàng |
| API_010 | /rest/v1/accounts | GET | Bearer token của nhân viên bán hàng | Trả về thông tin tài khoản, role = NVBH và status = active |
| API_011 | /api/check-tables | GET | Bearer token của nhân viên bán hàng | Trả về 200 OK, response JSON có success = true |

## Tiêu chí kiểm tra trong Postman

Với nhóm request chưa đăng nhập, em thiết kế các assertion để kiểm tra:

+ Status code trả về là 401.
+ Response trả về đúng định dạng JSON.
+ Nội dung response có error = Unauthorized.
+ Nội dung response có code = AUTH_REQUIRED.
+ Path trong response đúng với endpoint được gọi.

Với nhóm request đăng nhập, em thiết kế các assertion để kiểm tra:

+ Status code trả về là 200.
+ Response trả về đúng định dạng JSON.
+ Sau khi đăng nhập, response có access_token.
+ Email trong response đúng với email tài khoản kiểm thử.

Với nhóm request kiểm tra quyền và gọi API sau đăng nhập, em thiết kế các assertion để kiểm tra:

+ Tài khoản admin có role = admin và status = active.
+ Tài khoản nhân viên bán hàng có role = NVBH và status = active.
+ API nội bộ /api/check-tables trả về 200 OK.
+ Response của API nội bộ có success = true.

Ví dụ mã kiểm thử trong Postman cho ca đăng nhập:

```javascript
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});

pm.test('Response is JSON', function () {
  pm.response.to.be.json;
});

const json = pm.response.json();
pm.environment.set('admin_access_token', json.access_token || '');

pm.test('Access token is returned', function () {
  pm.expect(json.access_token).to.be.a('string').and.not.empty;
});
```

Như vậy, bộ ca kiểm thử API không chỉ dừng lại ở việc kiểm tra khi chưa đăng nhập, mà còn kiểm tra được luồng đăng nhập hợp lệ và khả năng gọi API sau khi đã xác thực.

# IX.3 Thực hiện kiểm thử tự động API với Postman/Newman

Sau khi thiết kế xong Postman Collection và Environment, em sử dụng Newman để chạy tự động toàn bộ bộ kiểm thử API bằng dòng lệnh. Việc sử dụng Newman giúp quá trình kiểm thử không phụ thuộc vào thao tác thủ công trên giao diện Postman, đồng thời có thể xuất kết quả ra file để lưu minh chứng.

## File sử dụng khi kiểm thử

+ Collection: API_Postman_Newman/collection/qlbh-api-security.postman_collection.json
+ Environment: API_Postman_Newman/environment/qlbh-api.postman_environment.json
+ Kết quả JSON: API_Postman_Newman/reports/newman-result.json
+ Bảng tổng hợp CSV: API_Postman_Newman/reports/api-testcases-summary.csv
+ Báo cáo HTML: API_Postman_Newman/reports/api-newman-report.html

## Lệnh chạy kiểm thử

```bash
npx --yes newman run collection/qlbh-api-security.postman_collection.json -e environment/qlbh-api.postman_environment.json -r "cli,json" --reporter-json-export reports/newman-result.json
```

Trong đó:

+ newman run: dùng để chạy Postman Collection bằng dòng lệnh.
+ -e: chỉ định file environment chứa các biến như base_url, supabase_url, tài khoản kiểm thử và token.
+ -r "cli,json": xuất kết quả ra màn hình terminal và file JSON.
+ --reporter-json-export: chỉ định vị trí lưu file kết quả JSON.

Lưu ý: khi chạy thực tế, mật khẩu của tài khoản kiểm thử được truyền bằng biến môi trường tạm thời, không lưu trực tiếp trong file báo cáo công khai.

Nếu cần chạy lại đầy đủ các ca đăng nhập, có thể truyền thêm các biến tài khoản khi chạy Newman:

```bash
npx --yes newman run collection/qlbh-api-security.postman_collection.json -e environment/qlbh-api.postman_environment.json --env-var "admin_email=<email_admin>" --env-var "admin_password=<mat_khau_admin>" --env-var "staff_email=<email_nhan_vien_ban_hang>" --env-var "staff_password=<mat_khau_nhan_vien_ban_hang>" -r "cli,json" --reporter-json-export reports/newman-result.json
```

## Kết quả thực thi

| Chỉ tiêu | Kết quả |
|---|---|
| Iterations | 1 executed, 0 failed |
| Requests | 11 executed, 0 failed |
| Test scripts | 11 executed, 0 failed |
| Assertions | 37 executed, 0 failed |
| Total run duration | 4484 ms |
| Average response time | 330.3 ms |
| Min response time | 120 ms |
| Max response time | 807 ms |

## Kết luận

Kết luận kết quả kiểm thử API như sau:

+ 11/11 request pass
+ 37/37 assertion pass
+ 0 request failed
+ 0 assertion failed
+ Thời gian phản hồi trung bình: 330.3 ms

Kết quả này cho thấy các API nội bộ được kiểm thử đều xử lý đúng theo trạng thái xác thực của người dùng. Khi chưa đăng nhập, hệ thống từ chối truy cập và trả về 401 Unauthorized với mã lỗi AUTH_REQUIRED. Khi đăng nhập bằng tài khoản admin và nhân viên bán hàng, hệ thống xác thực thành công, trả về token hợp lệ, xác định đúng vai trò tài khoản và cho phép gọi API nội bộ /api/check-tables. Vì vậy, trong phạm vi bộ kiểm thử này, em có thể kết luận rằng cơ chế xác thực API hoạt động đúng với cả trường hợp chưa đăng nhập và đã đăng nhập.
