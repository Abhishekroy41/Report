import { HashRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { useEffect } from 'react';
import useReadingsStore from './store/useReadingsStore';
import useSettingsStore from './store/useSettingsStore';

function App() {
  const hydrateReadings = useReadingsStore((state) => state.hydrate);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);

  useEffect(() => {
    hydrateReadings();
    hydrateSettings();
  }, []);

  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default App
