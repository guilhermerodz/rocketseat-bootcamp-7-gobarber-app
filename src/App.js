import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { useSelector } from 'react-redux';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import createRouter from './routes';

export default function App() {
  useEffect(() => {
    function setAndroidNavigationBar() {
      changeNavigationBarColor('#8d41a8');
    }

    function handleAppStateChange(nextAppState) {
      if (nextAppState === 'active') setAndroidNavigationBar();
    }

    setAndroidNavigationBar();

    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const signed = useSelector(state => state.auth.signed);

  const Routes = createRouter(signed);

  return <Routes />;
}
