# IX.2 Thiết kế ca kiểm thử tự động API với Postman/Newman

Trong phần kiểm thử tự động API, em lựa chọn kiểm tra một số API nội bộ của hệ thống Quản lý bán hàng trên môi trường deploy:

https://qlkh-tkhttt.vercel.app

Mục tiêu của phần này là kiểm tra phản hồi của hệ thống khi người dùng chưa đăng nhập nhưng cố gắng truy cập các API nội bộ. Đây là nhóm kiểm thử quan trọng vì các API liên quan đến danh mục, kiểm tra bảng dữ liệu và xử lý đổi trả không nên cho phép truy cập nếu người dùng chưa có phiên đăng nhập hợp lệ.

Bộ kiểm thử được thiết kế bằng Postman Collection. Sau đó, collection được chạy tự động bằng Newman để tạo kết quả kiểm thử dạng JSON và HTML.

## Bảng thiết kế ca kiểm thử API

| ID | API kiểm thử | Method | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|---|---|
| API_001 | /api/categories | GET | Không gửi cookie/session đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_002 | /api/categories | POST | Không gửi cookie/session, body thiếu name_category và description_category | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_003 | /api/check-tables | GET | Không gửi cookie/session đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_004 | /api/partners/returns | GET | Không gửi cookie/session đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_005 | /api/partners/returns | POST | Không gửi cookie/session, body thiếu dữ liệu đổi trả | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |

## Tiêu chí kiểm tra trong Postman

Với mỗi request, em thiết kế các assertion trong tab Tests của Postman để kiểm tra:

+ Status code trả về là 401.
+ Response trả về đúng định dạng JSON.
+ Nội dung response có error = Unauthorized.
+ Nội dung response có code = AUTH_REQUIRED.
+ Path trong response đúng với endpoint được gọi.

Ví dụ mã kiểm thử trong Postman:

```javascript
pm.test('Status code is 401', function () {
  pm.response.to.have.status(401);
});

pm.test('Response is JSON', function () {
  pm.response.to.be.json;
});

pm.test('Response indicates unauthorized access', function () {
  const json = pm.response.json();
  pm.expect(json.error).to.eql('Unauthorized');
  pm.expect(json.code).to.eql('AUTH_REQUIRED');
});
```

Như vậy, mỗi API không chỉ được kiểm tra trạng thái HTTP mà còn được kiểm tra cả nội dung phản hồi. Điều này giúp bảo đảm rằng hệ thống không chỉ từ chối request chưa xác thực, mà còn trả về đúng thông báo lỗi theo cấu trúc đã thiết kế.

# IX.3 Thực hiện kiểm thử tự động API với Postman/Newman

Sau khi thiết kế xong Postman Collection và Environment, em sử dụng Newman để chạy tự động toàn bộ bộ kiểm thử API bằng dòng lệnh. Việc sử dụng Newman giúp quá trình kiểm thử không phụ thuộc vào thao tác thủ công trên giao diện Postman, đồng thời có thể xuất kết quả ra file để lưu minh chứng.

## File sử dụng khi kiểm thử

+ Collection: API_Postman_Newman/collection/qlbh-api-security.postman_collection.json
+ Environment: API_Postman_Newman/environment/qlbh-api.postman_environment.json
+ Kết quả JSON: API_Postman_Newman/reports/newman-result.json
+ Báo cáo HTML: API_Postman_Newman/reports/api-newman-report.html

## Lệnh chạy kiểm thử

```bash
npx --yes newman run collection/qlbh-api-security.postman_collection.json -e environment/qlbh-api.postman_environment.json -r "cli,json" --reporter-json-export reports/newman-result.json
```

Trong đó:

+ newman run: dùng để chạy Postman Collection bằng dòng lệnh.
+ -e: chỉ định file environment chứa biến base_url.
+ -r "cli,json": xuất kết quả ra màn hình terminal và file JSON.
+ --reporter-json-export: chỉ định vị trí lưu file kết quả JSON.

## Kết quả thực thi

| Chỉ tiêu | Kết quả |
|---|---|
| Iterations | 1 executed, 0 failed |
| Requests | 5 executed, 0 failed |
| Test scripts | 5 executed, 0 failed |
| Assertions | 15 executed, 0 failed |
| Total run duration | 1477 ms |
| Average response time | 223.2 ms |
| Min response time | 164 ms |
| Max response time | 432 ms |

## Kết luận

Kết luận kết quả kiểm thử API như sau:

+ 5/5 request pass
+ 15/15 assertion pass
+ 0 request failed
+ 0 assertion failed
+ Thời gian phản hồi trung bình: 223.2 ms

Kết quả này cho thấy các API nội bộ được kiểm thử đều từ chối request chưa đăng nhập đúng như mong đợi. Cụ thể, các API trả về status code 401 Unauthorized, response có định dạng JSON và mã lỗi AUTH_REQUIRED. Vì vậy, trong phạm vi bộ kiểm thử này, em có thể kết luận rằng cơ chế bảo vệ API trước truy cập chưa xác thực hoạt động đúng.
