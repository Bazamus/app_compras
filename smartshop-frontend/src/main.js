import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            staleTime: 5 * 60 * 1000, // 5 minutos
        },
    },
});
// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        console.error('Error boundary caught an error:', error);
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Error details:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Algo sali\u00F3 mal" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Ha ocurrido un error inesperado." }), _jsx("button", { onClick: () => window.location.reload(), className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Recargar p\u00E1gina" })] }) }));
        }
        return this.props.children;
    }
}
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}
console.log('App starting...', {
    API_URL: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD
});
ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(App, {}) }) }) }));
