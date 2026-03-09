# Bugfix Requirements Document

## Introduction

Người dùng gặp lỗi "Không có URI chuyển hướng trong thông số: Không có URI chuyển hướng" khi đăng nhập Facebook thông qua OAuth WebView flow. Lỗi xảy ra sau khi người dùng xác nhận cấp quyền trên Facebook, ngăn không cho quá trình đăng nhập hoàn tất.

Phân tích cho thấy có hai vấn đề nghiêm trọng:
1. **App ID Mismatch**: `LoginScreen.tsx` sử dụng Facebook App ID `1382104650596188` trong khi `app.json` cấu hình App ID `1663215287999924`
2. **Redirect URI Configuration**: Redirect URI được tạo bởi `expo-auth-session` không được chấp nhận bởi Meta Developer Console, khiến người dùng không thể cấu hình OAuth redirect URI đúng cách

Bug này ngăn chặn hoàn toàn tính năng đăng nhập Facebook, ảnh hưởng đến trải nghiệm người dùng và giảm tỷ lệ chuyển đổi đăng ký.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `LoginScreen.tsx` uses Facebook App ID `1382104650596188` AND `app.json` configures Facebook App ID `1663215287999924` THEN the system creates OAuth requests with mismatched App IDs causing authentication failures

1.2 WHEN `expo-auth-session` generates redirect URI using scheme `fb1382104650596188` AND this scheme does not match the App ID in `app.json` (`fb1663215287999924`) THEN Facebook OAuth flow fails with "Không có URI chuyển hướng trong thông số" error

1.3 WHEN user completes Facebook authentication and Facebook attempts to redirect back to the app THEN the redirect fails because the redirect URI is not properly registered in Meta Developer Console

1.4 WHEN the redirect URI format is `eztroalpha://expo-development-client/?url=http%3A%2F%2F172.20.10.2%3A8081` THEN Meta Developer Console rejects this URI format and does not allow it to be configured as a valid OAuth redirect URI

### Expected Behavior (Correct)

2.1 WHEN Facebook OAuth is configured THEN the system SHALL use a single, consistent Facebook App ID across all configuration files (`LoginScreen.tsx`, `app.json`, and Facebook scheme)

2.2 WHEN `expo-auth-session` generates redirect URI THEN the system SHALL use the correct Facebook scheme format that matches the configured App ID (e.g., `fb{APP_ID}://authorize`)

2.3 WHEN user completes Facebook authentication THEN Facebook SHALL successfully redirect back to the app using a properly registered redirect URI that Meta Developer Console accepts

2.4 WHEN configuring OAuth redirect URI in Meta Developer Console THEN the system SHALL provide a redirect URI format that is accepted by Meta (e.g., `fb{APP_ID}://authorize` or `https://auth.expo.io/@{username}/{slug}`)

2.5 WHEN user clicks Facebook login button and completes authentication THEN the system SHALL receive the access token, fetch user info from Facebook Graph API, send to backend, and navigate to main screen without errors

### Unchanged Behavior (Regression Prevention)

3.1 WHEN user logs in with Google OAuth THEN the system SHALL CONTINUE TO authenticate successfully using the existing Google OAuth configuration

3.2 WHEN user logs in with email and password THEN the system SHALL CONTINUE TO authenticate successfully using the existing credential-based login flow

3.3 WHEN Facebook login succeeds and returns user info THEN the backend SHALL CONTINUE TO create or retrieve user accounts, generate JWT tokens, and return authentication response as currently implemented

3.4 WHEN Facebook user info is received THEN the system SHALL CONTINUE TO parse name fields, upload profile pictures, and create user records with the same data structure

3.5 WHEN authentication succeeds (any method) THEN the system SHALL CONTINUE TO dispatch Redux actions, store tokens, and navigate to the main screen using the existing navigation flow
