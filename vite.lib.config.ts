import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solid(),
    dts({ 
      include: ['src/lib'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'GraphQLVoyagerLite',
      fileName: (format) => `index.${format === 'es' ? 'es' : 'umd'}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['graphql', 'solid-js', 'solid-js/web', 'solid-js/store'],
      output: {
        globals: {
          'graphql': 'graphql',
          'solid-js': 'solid',
          'solid-js/web': 'solidWeb',
          'solid-js/store': 'solidStore'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: true
  }
}); 