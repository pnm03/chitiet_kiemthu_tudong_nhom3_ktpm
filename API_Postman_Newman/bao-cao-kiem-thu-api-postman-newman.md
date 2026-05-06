# IX.2 Thiết kế ca kiểm thử tự động API với Postman/Newman

Trong phần kiểm thử tự động API, em lựa chọn kiểm tra nhóm API nội bộ của hệ thống quản lý bán hàng ở trạng thái chưa đăng nhập. Đây là nhóm kiểm thử quan trọng vì các API như danh mục sản phẩm, kiểm tra bảng dữ liệu và xử lý yêu cầu đổi trả đều không nên cho phép truy cập khi người dùng chưa có session hợp lệ.

Bộ kiểm thử được thiết kế bằng Postman Collection, sau đó chạy tự động bằng Newman. Mỗi request trong collection tương ứng với một ca kiểm thử API. Với mỗi request, em viết các đoạn test script để kiểm tra mã trạng thái HTTP, định dạng response và nội dung lỗi trả về.

## Danh sách ca kiểm thử

| ID | API kiểm thử | Method | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|---|---|
| API_001 | /api/categories | GET | Không gửi cookie/session đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_002 | /api/categories | POST | Không gửi cookie/session, body thiếu 
ame_category, description_category | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_003 | /api/check-tables | GET | Không gửi cookie/session đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_004 | /api/partners/returns | GET | Không gửi cookie/session đăng nhập | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |
| API_005 | /api/partners/returns | POST | Không gửi cookie/session, body thiếu dữ liệu đổi trả | Trả về 401 Unauthorized, response JSON có code = AUTH_REQUIRED |

## Tiêu chí kiểm tra trong Postman

Mỗi request được kiểm tra bằng 3 nhóm assertion chính:

- Kiểm tra status code trả về là 401.
- Kiểm tra response trả về đúng định dạng JSON.
- Kiểm tra nội dung response có error = Unauthorized, code = AUTH_REQUIRED và path đúng với endpoint được gọi.

Ví dụ test script trong Postman:

`javascript
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
`

# IX.3 Thực hiện kiểm thử tự động API với Postman/Newman

Sau khi thiết kế xong collection và environment, em sử dụng Newman để chạy tự động toàn bộ bộ kiểm thử API bằng dòng lệnh. Việc chạy bằng Newman giúp quá trình kiểm thử không phụ thuộc vào thao tác thủ công trong giao diện Postman, đồng thời có thể xuất kết quả ra file JSON và HTML để lưu minh chứng.

## File kiểm thử

- Collection: API_Postman_Newman/collection/qlbh-api-security.postman_collection.json
- Environment: API_Postman_Newman/environment/qlbh-api.postman_environment.json
- Kết quả JSON: API_Postman_Newman/reports/newman-result.json
- Báo cáo HTML: API_Postman_Newman/reports/api-newman-report.html

## Lệnh chạy kiểm thử

`ash
npx --yes newman run collection/qlbh-api-security.postman_collection.json -e environment/qlbh-api.postman_environment.json -r "cli,json" --reporter-json-export reports/newman-result.json
`

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

	5/5 request pass
	15/15 assertion pass
	0 request failed
	0 assertion failed
	Thời gian phản hồi trung bình: 223.2 ms

Kết quả này cho thấy các API nội bộ được kiểm thử đều từ chối request chưa đăng nhập đúng như mong đợi. Cụ thể, các API trả về status code 401 Unauthorized, response có định dạng JSON và mã lỗi AUTH_REQUIRED. Vì vậy, trong phạm vi bộ kiểm thử này, em có thể kết luận rằng cơ chế bảo vệ API trước truy cập chưa xác thực hoạt động đúng.
