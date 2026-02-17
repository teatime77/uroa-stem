// root/vite.config.base.ts
import { UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const baseConfig: UserConfig = {
  plugins: [tsconfigPaths()],
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      // 解決できないパスをここにリストアップする
      external: ['firebase'], // firebaseという名前のインポートを無視する
    },
  }
};