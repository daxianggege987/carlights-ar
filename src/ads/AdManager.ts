import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, AD_CONFIG } from './config';

class AdManager {
  private interstitial: InterstitialAd | null = null;
  private backCount = 0;
  private lastInterstitialTime = 0;
  private appStartTime = Date.now();
  private isAdLoaded = false;
  private isAdShowing = false;
  private started = false;

  /** Call only after App Tracking Transparency (iOS) and mobileAds.initialize(). */
  start() {
    if (this.started) return;
    this.started = true;
    this.appStartTime = Date.now();
    this.loadInterstitial();
  }

  private loadInterstitial() {
    if (!this.started) return;
    try {
      this.interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);
      this.isAdLoaded = false;

      this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
        this.isAdLoaded = true;
      });

      this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        this.isAdShowing = false;
        this.isAdLoaded = false;
        this.loadInterstitial();
      });

      this.interstitial.addAdEventListener(AdEventType.ERROR, () => {
        this.isAdLoaded = false;
        setTimeout(() => this.loadInterstitial(), 30_000);
      });

      this.interstitial.load();
    } catch {
      // Ad SDK not available (e.g. web)
    }
  }

  canShowInterstitial(isRedSeverity: boolean): boolean {
    if (!this.started) return false;
    if (isRedSeverity) return false;

    const now = Date.now();
    if (now - this.appStartTime < AD_CONFIG.newUserGracePeriodMs) return false;
    if (now - this.lastInterstitialTime < AD_CONFIG.interstitialCooldownMs) return false;
    if (!this.isAdLoaded || this.isAdShowing) return false;

    return true;
  }

  tryShowInterstitial(isRedSeverity: boolean): boolean {
    this.backCount++;

    if (this.backCount % AD_CONFIG.interstitialFrequency !== 0) return false;
    if (!this.canShowInterstitial(isRedSeverity)) return false;

    try {
      this.interstitial?.show();
      this.isAdShowing = true;
      this.lastInterstitialTime = Date.now();
      return true;
    } catch {
      return false;
    }
  }
}

export const adManager = new AdManager();
