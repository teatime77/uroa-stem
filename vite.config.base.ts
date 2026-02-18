// root/vite.config.base.ts
import { UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const baseConfig: UserConfig = {
  plugins: [
    // TypeScriptのpathsエイリアス (@i18nなど) をViteに教える
    tsconfigPaths({
      // サブプロジェクトの階層から親のtsconfig.jsonまで探しに行く設定
      root: '../' 
    })
  ],
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      // 解決できないパスをここにリストアップする
      external: ['firebase'], // firebaseという名前のインポートを無視する
    },
  }
};