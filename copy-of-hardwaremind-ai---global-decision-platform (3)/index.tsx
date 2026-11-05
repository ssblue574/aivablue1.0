import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { addFeatureClasses, logCompatibilityReport } from './utils/browserCompat';

// Initialize browser compatibility detection
addFeatureClasses().then(() => {
  // Log compatibility report in development
  if (import.meta.env.DEV) {
    logCompatibilityReport();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);