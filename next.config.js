/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  env: {
    VITE_APP_FIREBASE_CONFIG: process.env.VITE_APP_FIREBASE_CONFIG,
    VITE_APP_BACKEND_V2_GET_URL: process.env.VITE_APP_BACKEND_V2_GET_URL,
    VITE_APP_BACKEND_V2_POST_URL: process.env.VITE_APP_BACKEND_V2_POST_URL,
    VITE_APP_LIBRARY_URL: process.env.VITE_APP_LIBRARY_URL,
    VITE_APP_LIBRARY_BACKEND: process.env.VITE_APP_LIBRARY_BACKEND,
    VITE_APP_WS_SERVER_URL: process.env.VITE_APP_WS_SERVER_URL,
    VITE_APP_PLUS_LP: process.env.VITE_APP_PLUS_LP,
    VITE_APP_PLUS_APP: process.env.VITE_APP_PLUS_APP,
    VITE_APP_AI_BACKEND: process.env.VITE_APP_AI_BACKEND,
    VITE_APP_FIREBASE_CONFIG: process.env.VITE_APP_FIREBASE_CONFIG
  }
};

module.exports = nextConfig;
