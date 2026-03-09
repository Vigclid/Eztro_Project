/**
 * Bug Condition Exploration Test for Facebook OAuth Configuration Mismatch
 * 
 * **Validates: Requirements 2.1, 2.2**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * GOAL: Surface counterexamples that demonstrate the configuration mismatch exists
 */

import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Facebook OAuth Configuration Bug Condition', () => {
  const appJsonPath = path.join(__dirname, '../app.json');
  const loginScreenPath = path.join(__dirname, '../src/screens/auth/LoginScreen.tsx');

  let appJsonContent: any;
  let loginScreenContent: string;

  beforeAll(() => {
    // Read configuration files
    appJsonContent = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    loginScreenContent = fs.readFileSync(loginScreenPath, 'utf-8');
  });

  /**
   * Property 1: Fault Condition - Facebook App ID and Redirect URI Mismatch
   * 
   * This property tests that Facebook OAuth configuration uses consistent App IDs
   * across all configuration files.
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS (this is correct - it proves the bug exists)
   * 
   * Counterexamples will demonstrate:
   * - Current App ID in LoginScreen.tsx vs app.json
   * - Current redirect URI scheme vs facebookScheme in app.json
   */
  describe('Property 1: Consistent Facebook App ID Usage', () => {
    it('should use the same Facebook App ID in LoginScreen.tsx and app.json', () => {
      // Extract App ID from app.json
      const appJsonFacebookAppId = appJsonContent.expo.facebookAppId;
      const appJsonFacebookScheme = appJsonContent.expo.facebookScheme;

      // Extract App ID from LoginScreen.tsx
      const clientIdMatch = loginScreenContent.match(/clientId:\s*["'](\d+)["']/);
      const schemeMatch = loginScreenContent.match(/scheme:\s*["'](fb\d+)["']/);

      expect(clientIdMatch).not.toBeNull();
      expect(schemeMatch).not.toBeNull();

      const loginScreenClientId = clientIdMatch![1];
      const loginScreenScheme = schemeMatch![1];

      // Log the current configuration for debugging
      console.log('=== CONFIGURATION MISMATCH DETECTED ===');
      console.log('app.json Facebook App ID:', appJsonFacebookAppId);
      console.log('app.json Facebook Scheme:', appJsonFacebookScheme);
      console.log('LoginScreen.tsx Client ID:', loginScreenClientId);
      console.log('LoginScreen.tsx Scheme:', loginScreenScheme);
      console.log('======================================');

      // ASSERTION: These should match (will fail on unfixed code)
      expect(loginScreenClientId).toBe(appJsonFacebookAppId);
      expect(loginScreenScheme).toBe(appJsonFacebookScheme);
    });

    it('should use redirect URI scheme that matches facebookScheme in app.json', () => {
      const appJsonFacebookScheme = appJsonContent.expo.facebookScheme;
      const schemeMatch = loginScreenContent.match(/scheme:\s*["'](fb\d+)["']/);

      expect(schemeMatch).not.toBeNull();
      const loginScreenScheme = schemeMatch![1];

      // Log the mismatch
      console.log('=== REDIRECT URI SCHEME MISMATCH ===');
      console.log('Expected (from app.json):', appJsonFacebookScheme);
      console.log('Actual (from LoginScreen.tsx):', loginScreenScheme);
      console.log('====================================');

      // ASSERTION: Scheme should match (will fail on unfixed code)
      expect(loginScreenScheme).toBe(appJsonFacebookScheme);
    });
  });

  /**
   * Property-Based Test: Facebook OAuth Configuration Consistency
   * 
   * This test generates various Facebook App IDs and verifies that the configuration
   * would be consistent if we were to use them.
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS because current configuration is inconsistent
   */
  describe('Property-Based Test: Configuration Consistency', () => {
    it('should maintain consistent App ID across all configuration points', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000000000000000, max: 9999999999999999 }), // Generate 16-digit Facebook App IDs
          (generatedAppId) => {
            const appIdString = generatedAppId.toString();

            // Extract actual values from files
            const actualAppJsonAppId = appJsonContent.expo.facebookAppId;
            const actualAppJsonScheme = appJsonContent.expo.facebookScheme;
            const clientIdMatch = loginScreenContent.match(/clientId:\s*["'](\d+)["']/);
            const schemeMatch = loginScreenContent.match(/scheme:\s*["'](fb\d+)["']/);

            const actualLoginScreenClientId = clientIdMatch ? clientIdMatch[1] : '';
            const actualLoginScreenScheme = schemeMatch ? schemeMatch[1] : '';

            // Check if current configuration is consistent
            const isAppJsonConsistent = actualAppJsonAppId === actualAppJsonScheme.replace('fb', '');
            const isLoginScreenConsistent = actualLoginScreenClientId === actualLoginScreenScheme.replace('fb', '');
            const isOverallConsistent = 
              actualAppJsonAppId === actualLoginScreenClientId &&
              actualAppJsonScheme === actualLoginScreenScheme;

            // Log inconsistencies
            if (!isOverallConsistent) {
              console.log('=== PROPERTY TEST FOUND INCONSISTENCY ===');
              console.log('Generated App ID for testing:', appIdString);
              console.log('app.json App ID:', actualAppJsonAppId);
              console.log('app.json Scheme:', actualAppJsonScheme);
              console.log('LoginScreen Client ID:', actualLoginScreenClientId);
              console.log('LoginScreen Scheme:', actualLoginScreenScheme);
              console.log('Is app.json internally consistent?', isAppJsonConsistent);
              console.log('Is LoginScreen internally consistent?', isLoginScreenConsistent);
              console.log('Is overall configuration consistent?', isOverallConsistent);
              console.log('========================================');
            }

            // ASSERTION: Configuration should be consistent (will fail on unfixed code)
            return isOverallConsistent;
          }
        ),
        { numRuns: 10 } // Run 10 times to surface the bug
      );
    });
  });

  /**
   * Edge Case Test: Verify OAuth Flow Would Fail with Current Configuration
   * 
   * This test simulates what would happen during the OAuth flow with mismatched configuration.
   */
  describe('Edge Case: OAuth Flow Failure Simulation', () => {
    it('should detect that OAuth redirect would fail due to scheme mismatch', () => {
      const appJsonFacebookAppId = appJsonContent.expo.facebookAppId;
      const appJsonFacebookScheme = appJsonContent.expo.facebookScheme;
      
      const clientIdMatch = loginScreenContent.match(/clientId:\s*["'](\d+)["']/);
      const schemeMatch = loginScreenContent.match(/scheme:\s*["'](fb\d+)["']/);

      const loginScreenClientId = clientIdMatch![1];
      const loginScreenScheme = schemeMatch![1];

      // Simulate OAuth flow
      const oauthRequestAppId = loginScreenClientId; // App ID used in OAuth request
      const redirectUriScheme = loginScreenScheme; // Scheme used in redirect URI
      const registeredScheme = appJsonFacebookScheme; // Scheme registered in app.json

      // Check if redirect would succeed
      const wouldRedirectSucceed = redirectUriScheme === registeredScheme;

      console.log('=== OAUTH FLOW SIMULATION ===');
      console.log('OAuth Request App ID:', oauthRequestAppId);
      console.log('Redirect URI Scheme:', redirectUriScheme);
      console.log('Registered Scheme (app.json):', registeredScheme);
      console.log('Would redirect succeed?', wouldRedirectSucceed);
      console.log('============================');

      // ASSERTION: Redirect should succeed (will fail on unfixed code)
      expect(wouldRedirectSucceed).toBe(true);
    });

    it('should verify that App ID in OAuth request matches app.json configuration', () => {
      const appJsonFacebookAppId = appJsonContent.expo.facebookAppId;
      const clientIdMatch = loginScreenContent.match(/clientId:\s*["'](\d+)["']/);
      const loginScreenClientId = clientIdMatch![1];

      // Simulate what Facebook OAuth server would check
      const oauthRequestAppId = loginScreenClientId;
      const expectedAppId = appJsonFacebookAppId;

      const wouldOAuthSucceed = oauthRequestAppId === expectedAppId;

      console.log('=== OAUTH REQUEST VALIDATION ===');
      console.log('OAuth Request App ID:', oauthRequestAppId);
      console.log('Expected App ID (app.json):', expectedAppId);
      console.log('Would OAuth request succeed?', wouldOAuthSucceed);
      console.log('===============================');

      // ASSERTION: OAuth request should use correct App ID (will fail on unfixed code)
      expect(wouldOAuthSucceed).toBe(true);
    });
  });
});
