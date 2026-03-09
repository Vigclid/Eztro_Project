# Hướng Dẫn Cấu Hình Meta Developer Console cho Facebook Login

## Tổng Quan

Tài liệu này hướng dẫn cách cấu hình Facebook App trong Meta Developer Console để Facebook OAuth login hoạt động đúng với ứng dụng EzTro.

## Thông Tin Cấu Hình

- **Facebook App ID**: `1382104650596188`
- **Redirect URI**: `https://auth.expo.io/@vigclid/EzTro_Alpha`
- **App Name**: EzTro
- **Expo Owner**: vigclid
- **Expo Slug**: EzTro_Alpha

## ⚠️ LƯU Ý QUAN TRỌNG

Meta Developer Console **KHÔNG chấp nhận** custom URL schemes như `fb1382104650596188://authorize` trong trường "Valid OAuth Redirect URIs". Bạn sẽ gặp lỗi:

```
oauth redirect uri[2] should represent a valid URL
```

**Giải pháp**: Sử dụng Expo Auth Proxy với HTTPS URL.

## Bước 1: Truy Cập Meta Developer Console

1. Mở trình duyệt và truy cập: https://developers.facebook.com/
2. Đăng nhập bằng tài khoản Facebook của bạn
3. Chọn "My Apps" ở góc trên bên phải
4. Tìm và chọn app có ID `1382104650596188` hoặc tên "EzTro"

## Bước 2: Cấu Hình Facebook Login

1. Trong dashboard của app, tìm và click vào "Facebook Login" trong menu bên trái
2. Nếu chưa có, click "Set Up" để thêm Facebook Login product
3. Chọn "Web" platform (quan trọng!)

## Bước 3: Cấu Hình Valid OAuth Redirect URIs

### 3.1 Truy Cập Settings

1. Trong menu "Facebook Login", click vào "Settings"
2. Tìm phần "Valid OAuth Redirect URIs"

### 3.2 Thêm Redirect URI

Thêm URI sau vào danh sách "Valid OAuth Redirect URIs":

```
https://auth.expo.io/@vigclid/EzTro_Alpha
```

**Giải thích**:
- Đây là Expo Authentication Proxy
- Meta chấp nhận vì là HTTPS URL hợp lệ
- Expo sẽ tự động redirect về app của bạn sau khi authentication thành công
- **KHÔNG** thêm `fb1382104650596188://authorize` - Meta sẽ reject

### 3.3 Lưu Cấu Hình

1. Click nút "Save Changes" ở cuối trang
2. Đợi vài giây để Meta xử lý thay đổi

## Bước 4: Cấu Hình iOS (Nếu Build cho iOS)

1. Trong dashboard, chọn "Settings" > "Basic"
2. Scroll xuống phần "iOS"
3. Click "Add Platform" nếu chưa có iOS
4. Thêm thông tin sau:
   - **Bundle ID**: `com.eztro.eztroalpha`
   - **iPhone Store ID**: (để trống nếu chưa có app trên App Store)

## Bước 5: Cấu Hình Android (Nếu Build cho Android)

1. Trong dashboard, chọn "Settings" > "Basic"
2. Scroll xuống phần "Android"
3. Click "Add Platform" nếu chưa có Android
4. Thêm thông tin sau:
   - **Package Name**: `com.eztro.eztroalpha`
   - **Class Name**: `com.eztro.eztroalpha.MainActivity`
   - **Key Hashes**: (generate từ keystore của bạn)

### Generate Key Hash cho Android

Chạy lệnh sau để generate key hash:

**Windows (PowerShell)**:
```powershell
keytool -exportcert -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore | openssl sha1 -binary | openssl base64
```

**macOS/Linux**:
```bash
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

Password mặc định: `android`

## Bước 6: Kiểm Tra App Status

1. Trong "Settings" > "Basic", kiểm tra "App Mode"
2. Nếu app đang ở chế độ "Development":
   - Chỉ tài khoản được thêm vào "Roles" mới có thể login
   - Thêm tester accounts trong "Roles" > "Test Users"
3. Để public app, chuyển sang "Live" mode (cần hoàn thành App Review)

## Bước 7: Thêm Test Users (Cho Development Mode)

1. Trong dashboard, chọn "Roles" > "Test Users"
2. Click "Add" để tạo test user mới
3. Hoặc thêm Facebook accounts hiện có vào "Roles" > "Roles"

## Bước 8: Verify Cấu Hình

### 8.1 Kiểm Tra App ID

Đảm bảo App ID trong các file sau khớp với `1382104650596188`:

**File: `EzTro_Alpha/app.json`**
```json
{
  "expo": {
    "facebookAppId": "1382104650596188",
    "facebookScheme": "fb1382104650596188"
  }
}
```

**File: `EzTro_Alpha/src/screens/auth/LoginScreen.tsx`**
```typescript
const [, responseFB, promptAsyncFB] = Facebook.useAuthRequest({
  clientId: "1382104650596188",
  redirectUri: "https://auth.expo.io/@vigclid/EzTro_Alpha",
});
```

### 8.2 Test Facebook Login

1. Rebuild app: `npx expo start --clear`
2. Click nút "Facebook" login
3. Nhập credentials và grant permissions
4. Verify redirect về app thành công
5. Verify user được tạo trong database

## Troubleshooting

### Lỗi: "oauth redirect uri should represent a valid URL"

**Nguyên nhân**: Bạn đang cố thêm custom URL scheme như `fb1382104650596188://authorize`

**Giải pháp**:
1. Xóa custom URL scheme
2. Chỉ dùng Expo Auth Proxy: `https://auth.expo.io/@vigclid/EzTro_Alpha`
3. Lưu changes

### Lỗi: "Không có URI chuyển hướng trong thông số"

**Nguyên nhân**: Redirect URI không được đăng ký trong Meta Developer Console

**Giải pháp**:
1. Kiểm tra lại "Valid OAuth Redirect URIs" trong Facebook Login Settings
2. Đảm bảo `https://auth.expo.io/@vigclid/EzTro_Alpha` đã được thêm
3. Lưu changes và đợi vài phút
4. Rebuild app: `npx expo start --clear`
5. Thử lại

### Lỗi: "App ID không hợp lệ"

**Nguyên nhân**: App ID trong code không khớp với Meta Developer Console

**Giải pháp**:
1. Verify App ID trong Meta Developer Console (Settings > Basic)
2. Kiểm tra App ID trong `app.json` và `LoginScreen.tsx`
3. Đảm bảo tất cả đều là `1382104650596188`
4. Rebuild app

### Lỗi: "This app is in development mode"

**Nguyên nhân**: App đang ở development mode và user chưa được thêm vào roles

**Giải pháp**:
1. Thêm user vào "Roles" > "Roles" hoặc "Test Users"
2. Hoặc chuyển app sang "Live" mode (cần App Review)

### Lỗi: "Invalid key hash" (Android)

**Nguyên nhân**: Key hash không khớp với keystore đang dùng để sign app

**Giải pháp**:
1. Generate lại key hash từ keystore hiện tại
2. Thêm key hash vào Android settings trong Meta Developer Console
3. Rebuild app

## Tại Sao Dùng Expo Auth Proxy?

1. **Meta chấp nhận**: HTTPS URL hợp lệ, không bị reject
2. **Tự động redirect**: Expo xử lý redirect về app
3. **Cross-platform**: Hoạt động trên cả iOS và Android
4. **Development friendly**: Hoạt động với Expo Go và development builds

## Tài Liệu Tham Khảo

- [Facebook Login for React Native](https://developers.facebook.com/docs/facebook-login/react-native)
- [Expo Facebook Authentication](https://docs.expo.dev/guides/authentication/#facebook)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Meta Developer Console](https://developers.facebook.com/)

## Liên Hệ

Nếu gặp vấn đề, vui lòng liên hệ team development hoặc tạo issue trong repository.

---

**Cập nhật lần cuối**: 2026-03-04
**Version**: 2.0.0 (Updated to use Expo Auth Proxy)
