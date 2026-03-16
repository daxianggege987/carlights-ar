import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const IS_DEV = __DEV__;

export const AD_UNIT_IDS = {
  banner: IS_DEV
    ? TestIds.BANNER
    : Platform.select({
        ios: 'ca-app-pub-4374876928430270/6464581662',
        android: 'ca-app-pub-4374876928430270/8424530591',
      }) ?? TestIds.BANNER,

  interstitial: IS_DEV
    ? TestIds.INTERSTITIAL
    : Platform.select({
        ios: 'ca-app-pub-4374876928430270/9643442609',
        android: 'ca-app-pub-4374876928430270/4265793739',
      }) ?? TestIds.INTERSTITIAL,
};

export const AD_CONFIG = {
  interstitialFrequency: 3,
  interstitialCooldownMs: 60_000,
  newUserGracePeriodMs: 180_000,
};
