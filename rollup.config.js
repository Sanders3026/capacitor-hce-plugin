import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default {
  input: 'dist/esm/index.js',
  plugins: [
    postcss({
      extract: true, // Extracts CSS to a separate file
      minimize: true, // Minifies the CSS
      inject: {
        insertAt: 'top', // Ensure CSS is injected at the top of the bundle
      },
    }),
    copy({
      targets: [
        { src: 'src/themes/*', dest: 'dist/esm/themes' },
        { src: 'src/css/*', dest: 'dist/esm/css' },

      ],
      verbose: true, // Log files being copied for debugging
    }),
  ],
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorHCECapacitorPlugin',
      globals: {
        '@capacitor/core': 'capacitorExports',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: ['@capacitor/core', 'react', 'react-router-dom', '@ionic/react', '@ionic/react-router'],
};
