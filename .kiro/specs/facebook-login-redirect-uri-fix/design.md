# Facebook Login Redirect URI Fix - Bugfix Design

## Overview

This bugfix addresses critical configuration mismatches in the Facebook OAuth login flow that prevent users from successfully authenticating. The bug manifests as a "Không có URI chuyển hướng trong thông số" (No redirect URI in parameters) error after users grant permissions on Facebook, blocking the authentication flow completely.

The fix involves two primary issues:
1. **App ID Mismatch**: Inconsistent Facebook App IDs across configuration files causing OAuth request failures
2. **Redirect URI Configuration**: Incorrect redirect URI scheme generation that doesn't match Meta Developer Console requirements

The solution requires aligning all Facebook App ID references to use the correct ID (`1382104650596188`) and ensuring the redirect URI scheme matches this App ID in both `LoginScreen.tsx` and `app.json`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when Facebook OAuth uses mismatched App IDs or incorrect redirect URI schemes
- **Property (P)**: The desired behavior - Facebook OAuth should use consistent App ID across all configs and generate redirect URIs that match the registered scheme
- **Preservation**: Existing Google OAuth and email/password login flows that must remain unchanged by the fix
- **handleFacebookLoginSuccess**: The function in `LoginScreen.tsx` that processes Facebook authentication tokens and user info
- **expo-auth-session**: The Expo library that generates OAuth redirect URIs and manages authentication flows
- **facebookScheme**: The URL scheme registered in `app.json` that Facebook uses to redirect back to the app after authentication
- **Meta Developer Console**: Facebook's developer portal where OAuth redirect URIs must be registered for the app

## Bug Details

### Fault Condition

The bug manifests when a user attempts to log in with Facebook and the OAuth flow uses mismatched configuration values. The `LoginScreen.tsx` component uses Facebook App ID `1382104650596188` (which is CORRECT) while `app.json` configures App ID `1663215287999924` (which is INCORRECT), creating an inconsistency. The redirect URI scheme `fb1382104650596188` in code is correct, but the `facebookScheme` configured in `app.json` (`fb1663215287999924`) doesn't match.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type FacebookOAuthRequest
  OUTPUT: boolean
  
  RETURN (input.clientId == "1382104650596188" 
         AND app.json.facebookAppId == "1663215287999924")
         OR (input.redirectUriScheme == "fb1382104650596188"
         AND app.json.facebookScheme == "fb1663215287999924")
         AND userCompletedFacebookAuth(input)
         AND redirectBackToAppFailed(input)
END FUNCTION
```

### Examples

- **Example 1**: User clicks Facebook login button → OAuth request uses App ID `1382104650596188` (correct) → User grants permissions → Facebook attempts redirect using scheme `fb1382104650596188` → Redirect fails with "Không có URI chuyển hướng trong thông số" error because `app.json` has wrong App ID `1663215287999924` → User stuck on Facebook page
  - **Expected**: `app.json` should use App ID `1382104650596188` and scheme `fb1382104650596188` to match the code

- **Example 2**: Developer checks console log → Sees "Redirect URI: eztroalpha://expo-development-client/?url=..." → Attempts to register this URI in Meta Developer Console → Meta rejects the URI format → Cannot configure valid redirect URI
  - **Expected**: Should generate redirect URI in format `fb1382104650596188://authorize` that Meta accepts

- **Example 3**: User on production build attempts Facebook login → OAuth uses App ID `1382104650596188` from code → But app manifest has `1663215287999924` → Redirect fails due to mismatch → Login fails
  - **Expected**: Should use consistent App ID `1382104650596188` across both code and `app.json`

- **Edge Case**: User switches between development and production builds → Different redirect URI schemes cause confusion → Some builds work, others don't
  - **Expected**: Consistent redirect URI scheme across all build types

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Google OAuth login must continue to work exactly as before with existing configuration
- Email/password login must continue to work exactly as before
- Backend authentication endpoints must continue to process Facebook user info the same way
- Redux state management for authentication must remain unchanged
- Navigation flow after successful login must remain unchanged
- User data parsing and profile picture upload logic must remain unchanged

**Scope:**
All inputs that do NOT involve Facebook OAuth configuration should be completely unaffected by this fix. This includes:
- Google OAuth flow (different clientId and redirectUri)
- Email/password authentication flow
- Backend API calls for user creation and JWT token generation
- Redux actions for setAccessToken and setUser
- Navigation to main screen after authentication
- Any other authentication methods added in the future

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Wrong App ID in app.json**: The `app.json` file contains Facebook App ID `1663215287999924` which doesn't match the CORRECT App ID used in `LoginScreen.tsx` (`1382104650596188`)
   - This suggests the `app.json` was configured with a different Facebook app or the App ID was incorrectly entered
   - The mismatch causes the app manifest to register the wrong scheme, leading to redirect failures

2. **Incorrect Redirect URI Scheme in app.json**: The `facebookScheme` in `app.json` is `fb1663215287999924` instead of `fb1382104650596188`
   - The scheme in `app.json` must match the App ID being used in the code
   - This creates a mismatch between the redirect URI sent to Facebook and the scheme registered in the app manifest

3. **Meta Developer Console Configuration Gap**: The redirect URI format generated by `expo-auth-session` may not match the format expected by Meta Developer Console
   - Development URIs like `eztroalpha://expo-development-client/?url=...` are not accepted by Meta
   - The correct format should be `fb{APP_ID}://authorize` or use Expo's auth proxy `https://auth.expo.io/@{username}/{slug}`

4. **Missing Configuration Synchronization**: There's no mechanism to ensure the App ID in code matches the App ID in `app.json`
   - Developers can easily change one without updating the other
   - This leads to configuration drift and hard-to-debug authentication issues

## Correctness Properties

Property 1: Fault Condition - Consistent Facebook App ID Usage

_For any_ Facebook OAuth authentication request, the system SHALL use the Facebook App ID `1382104650596188` consistently across `LoginScreen.tsx`, `app.json`, and the redirect URI scheme, ensuring OAuth requests are properly authenticated by Facebook's servers.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Non-Facebook Authentication Methods

_For any_ authentication request that is NOT Facebook OAuth (Google OAuth, email/password, or future methods), the system SHALL produce exactly the same behavior as the original code, preserving all existing authentication flows, backend API calls, Redux state management, and navigation logic.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `EzTro_Alpha/app.json`

**Specific Changes**:
1. **Update Facebook App ID**: Change `facebookAppId` from `1663215287999924` to `1382104650596188`
   - Line with `"facebookAppId": "1663215287999924"` → `"facebookAppId": "1382104650596188"`
   - This ensures app manifest uses the correct App ID matching `LoginScreen.tsx`

2. **Update Facebook Scheme**: Change `facebookScheme` from `fb1663215287999924` to `fb1382104650596188`
   - Line with `"facebookScheme": "fb1663215287999924"` → `"facebookScheme": "fb1382104650596188"`
   - This ensures the redirect URI scheme matches the App ID

3. **Update iOS Info.plist Facebook App ID**: Change `FacebookAppID` from `1663215287999924` to `1382104650596188`
   - In `ios.infoPlist` section: `"FacebookAppID": "1663215287999924"` → `"FacebookAppID": "1382104650596188"`
   - This ensures iOS configuration matches the correct App ID

**File 2**: `EzTro_Alpha/src/screens/auth/LoginScreen.tsx`

**Specific Changes**:
1. **Verify Facebook App ID is correct**: Confirm `clientId: "1382104650596188"` (line 71)
   - No change needed - this is already correct

2. **Verify Redirect URI Scheme is correct**: Confirm `scheme: "fb1382104650596188"` (line 68)
   - No change needed - this is already correct

3. **Remove Unused Variables**: Clean up unused `redirectUri` variable (line 52-54)
   - This variable is declared but never used, causing a warning
   - Remove to clean up code

**File 3**: Meta Developer Console Configuration

**Specific Changes**:
1. **Register correct redirect URIs** for App ID `1382104650596188`:
   - Add `fb1382104650596188://authorize` to Valid OAuth Redirect URIs
   - Add `https://auth.expo.io/@vigclid/EzTro_Alpha` as fallback
   - Add development URIs if needed (e.g., `exp://192.168.x.x:8081`)

2. **Verify App ID in Meta Console**: Ensure you're configuring the app with ID `1382104650596188`
   - If currently using app `1663215287999924`, switch to the correct app in Meta Developer Console

**Test Cases**:
1. **App ID Mismatch Test**: Verify that OAuth request uses App ID `1382104650596188` (correct) while `app.json` has `1663215287999924` (incorrect) (will fail on unfixed code)
2. **Redirect URI Scheme Test**: Verify that redirect URI uses scheme `fb1382104650596188` (correct) but `app.json` has `fb1663215287999924` (incorrect) (will fail on unfixed code)
3. **OAuth Flow Test**: Simulate complete Facebook login flow and observe redirect failure with "Không có URI chuyển hướng" error (will fail on unfixed code)
4. **Meta Console Registration Test**: Attempt to register the generated redirect URI in Meta Developer Console for App ID `1382104650596188` and verify it's accepted (will fail if using wrong app)nd preserves existing behavior.

**Expected Counterexamples**:
- OAuth requests succeed with App ID `1382104650596188` in code, but redirect fails because `app.json` has wrong App ID `1663215287999924`
- Redirect back to app fails because redirect URI scheme in `app.json` doesn't match the scheme used in code
- Meta Developer Console accepts redirect URI format `fb1382104650596188://authorize` when registered for the correct app
- Possible causes: wrong App ID in app.json, incorrect scheme in app.json, Meta Console configured for wrong appsts on the UNFIXED code to observe failures and understand the root cause. Verify that the App ID mismatch and redirect URI issues cause authentication failures.

**Test Cases**:
1. **App ID Mismatch Test**: Verify that OAuth request uses App ID `1382104650596188` while `app.json` has `1663215287999924` (will fail on unfixed code)
2. **Redirect URI Scheme Test**: Verify that redirect URI uses scheme `fb1382104650596188` instead of `fb1663215287999924` (will fail on unfixed code)
3. **OAuth Flow Test**: Simulate complete Facebook login flow and observe redirect failure with "Không có URI chuyển hướng" error (will fail on unfixed code)
4. **Meta Console Registration Test**: Attempt to register the generated redirect URI in Meta Developer Console and observe rejection (will fail on unfixed code)
```
FOR ALL input WHERE isBugCondition(input) DO
  result := facebookOAuthFlow_fixed(input)
  ASSERT result.appId == "1382104650596188"
  ASSERT result.redirectUriScheme == "fb1382104650596188"
  ASSERT result.redirectSuccess == true
  ASSERT result.userAuthenticated == true
END FOR
```
**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := facebookOAuthFlow_fixed(input)
  ASSERT result.appId == "1663215287999924"
  ASSERT result.redirectUriScheme == "fb1663215287999924"
  ASSERT result.redirectSuccess == true
  ASSERT result.userAuthenticated == true
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT googleOAuthFlow_original(input) = googleOAuthFlow_fixed(input)
  ASSERT emailPasswordLogin_original(input) = emailPasswordLogin_fixed(input)
  ASSERT backendApiCalls_original(input) = backendApiCalls_fixed(input)
  ASSERT navigationFlow_original(input) = navigationFlow_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
### Unit Tests

- Test Facebook OAuth configuration uses correct App ID `1382104650596188` in both code and app.json
- Test redirect URI scheme matches `fb1382104650596188` in both code and app.json
- Test that Facebook authentication token is correctly processed
- Test that user info is correctly fetched from Facebook Graph API
- Test edge cases (network failures, invalid tokens, missing user data)
1. **Google OAuth Preservation**: Observe that Google login works correctly on unfixed code, then write test to verify this continues after fix
2. **Email/Password Preservation**: Observe that credential-based login works correctly on unfixed code, then write test to verify this continues after fix
3. **Backend API Preservation**: Observe that user creation and JWT token generation work correctly on unfixed code, then write test to verify this continues after fix
4. **Navigation Preservation**: Observe that navigation to main screen works correctly on unfixed code, then write test to verify this continues after fix

### Unit Tests

- Test Facebook OAuth configuration uses correct App ID `1663215287999924`
- Test redirect URI scheme matches `facebookScheme` from `app.json`
- Test that Facebook authentication token is correctly processed
- Test that user info is correctly fetched from Facebook Graph API
- Test edge cases (network failures, invalid tokens, missing user data)

### Property-Based Tests

- Generate random Facebook user profiles and verify backend correctly creates user accounts
- Generate random authentication states and verify Redux state updates correctly
- Test that all non-Facebook authentication methods continue to work across many scenarios
- Generate random navigation states and verify navigation flow remains unchanged

### Integration Tests

- Test full Facebook OAuth flow from button click to main screen navigation
- Test switching between Facebook, Google, and email/password authentication methods
- Test that Meta Developer Console accepts the generated redirect URI format
- Test Facebook login in both development and production builds
- Test that visual feedback (loading indicators, success messages) occurs correctly
