import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { Platform, InteractionManager } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { adManager } from './AdManager';

const AdsSafeContext = createContext(false);

/**
 * iOS: Run ATT before any ad SDK init. Uses InteractionManager so the first
 * frame can paint (helps iPad / review devices see the prompt reliably), then
 * getTrackingPermissionsAsync → request if undetermined → mobileAds.initialize.
 */
export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [adsSafe, setAdsSafe] = useState(Platform.OS === 'web');

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let cancelled = false;

    const run = async () => {
      try {
        if (Platform.OS === 'ios') {
          const Tracking = await import('expo-tracking-transparency');
          const { status: before } =
            await Tracking.getTrackingPermissionsAsync();
          if (cancelled) return;

          if (before === 'undetermined') {
            await Tracking.requestTrackingPermissionsAsync();
          }
        }
        if (cancelled) return;

        await mobileAds().initialize();
        if (cancelled) return;

        adManager.start();
        setAdsSafe(true);
      } catch {
        if (!cancelled) {
          adManager.start();
          setAdsSafe(true);
        }
      }
    };

    const task = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;
      run();
    });

    return () => {
      cancelled = true;
      task.cancel?.();
    };
  }, []);

  const value = useMemo(() => adsSafe, [adsSafe]);

  return (
    <AdsSafeContext.Provider value={value}>{children}</AdsSafeContext.Provider>
  );
}

export function useAdsSafe(): boolean {
  return useContext(AdsSafeContext);
}
