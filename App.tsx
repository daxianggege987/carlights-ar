import React, { useState, useCallback, useEffect } from 'react';
import { I18nManager, StatusBar, Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { Screen } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import DetailScreen from './src/screens/DetailScreen';

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

async function initAds() {
  try {
    if (Platform.OS === 'ios') {
      const { requestTrackingPermissionsAsync } = require('expo-tracking-transparency');
      await requestTrackingPermissionsAsync();
    }
    await mobileAds().initialize();
  } catch {
    // Ads not available (e.g. web or simulator without ads)
  }
}

export default function App() {
  const [screenStack, setScreenStack] = useState<Screen[]>([{ name: 'home' }]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initAds();
    }
  }, []);

  const currentScreen = screenStack[screenStack.length - 1];

  const navigate = useCallback((screen: Screen) => {
    setScreenStack((prev) => [...prev, screen]);
  }, []);

  const goBack = useCallback(() => {
    setScreenStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'home':
        return <HomeScreen navigate={navigate} />;
      case 'browse':
        return (
          <BrowseScreen
            initialCategory={currentScreen.category}
            navigate={navigate}
            goBack={goBack}
          />
        );
      case 'detail':
        return (
          <DetailScreen
            lightId={currentScreen.lightId}
            navigate={navigate}
            goBack={goBack}
          />
        );
      default:
        return <HomeScreen navigate={navigate} />;
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />
      {renderScreen()}
    </>
  );
}
