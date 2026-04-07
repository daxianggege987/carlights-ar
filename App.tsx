import React, { useState, useCallback } from 'react';
import { I18nManager, StatusBar } from 'react-native';
import { Screen } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import DetailScreen from './src/screens/DetailScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import QuizScreen from './src/screens/QuizScreen';
import { AdsProvider } from './src/ads/AdsContext';

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function App() {
  const [screenStack, setScreenStack] = useState<Screen[]>([{ name: 'home' }]);

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
            initialSeverity={currentScreen.severity}
            navigate={navigate}
            goBack={goBack}
          />
        );
      case 'checklist':
        return <ChecklistScreen goBack={goBack} />;
      case 'quiz':
        return <QuizScreen goBack={goBack} />;
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
    <AdsProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />
      {renderScreen()}
    </AdsProvider>
  );
}
