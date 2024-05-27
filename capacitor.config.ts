import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bucapps.sango',
  appName: 'SANGO',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    }
  },
  plugins: {
    GoogleAuth: {
      androidClientId: '726792798295-vbgcc63j11lu3k81fc588ft4duguat34.apps.googleusercontent.com',
      serverClientId: "726792798295-vbgcc63j11lu3k81fc588ft4duguat34.apps.googleusercontent.com",
      scopes: [
        'profile',
        'email'
      ],
      forceCodeForRefreshToken: true
    }
  }

};

export default config;
