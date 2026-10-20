import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_', 'HTTPS', 'PORT']);

  const envWithProcess = {
    'process.env': '{}',
  };

  for (const [key, val] of Object.entries(env)) {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
      envWithProcess[`process.env.${key}`] = JSON.stringify(val);
    }
  }

  envWithProcess['process.env.NODE_ENV'] = JSON.stringify(mode);
  envWithProcess['process.env.PUBLIC_URL'] = JSON.stringify('');

  return {
    plugins: [react()],
    define: envWithProcess,
    resolve: {
      alias: {
        'src': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3001,
      open: false,
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
    },
  };
});
