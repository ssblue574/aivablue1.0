import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            // Manual chunk splitting for better caching
            manualChunks: {
              // React core
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              // Three.js and 3D libraries
              'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
              // Charts library
              'charts-vendor': ['recharts'],
              // UI utilities
              'ui-vendor': ['lucide-react', 'clsx'],
            },
          },
        },
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Minification settings (using esbuild for better performance)
        minify: 'esbuild',
        // Source maps for production debugging (optional)
        sourcemap: mode !== 'production',
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: ['@react-three/fiber', '@react-three/drei'],
      },
    };
});
