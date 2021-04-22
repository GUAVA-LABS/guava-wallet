import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { WalletProvider } from './utils/context';
import { HashRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.render(
    <ErrorBoundary>
    <WalletProvider>
        <Router>
            <App />
        </Router>
    </WalletProvider>
    </ErrorBoundary>,
    
    document.getElementById('root'),
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
        navigator.serviceWorker.register('/serviceWorker.js').catch(() => null),
    );
}

if (module.hot) {
    module.hot.accept();
}
