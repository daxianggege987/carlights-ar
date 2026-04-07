import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from './config';
import { colors } from '../theme';
import { useAdsSafe } from './AdsContext';

export default function BannerAdView() {
  const [hasError, setHasError] = useState(false);
  const adsSafe = useAdsSafe();

  if (Platform.OS === 'web' || !adsSafe || hasError) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    paddingVertical: 2,
  },
});
