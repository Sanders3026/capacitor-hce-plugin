import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';

export default {
  input: 'dist/esm/index.js',
  plugins: [{
    resolveId(source) {
      // Ignore missing CSS file
      if (source === './themes/variables.css') {
        return { id: source, external: true };
      }
      if (source === '../css/style.css') {
        return { id: source, external: true };
      }if (source === '..') {
        return { id: source, external: true };
      }
      if (source === '../css/Modal.css') {
        return { id: source, external: true };
      }
      return null;
    },
  },
    css({ output: 'bundle.css' }),
    postcss({
      extract: true,
      minimize: true,
      inject: {
        insertAt: 'top',
      },
      extensions: ['.css'],
    }),
    copy({
      targets: [
        { src: 'src/themes/*', dest: 'dist/esm/themes' },
        { src: 'src/css/*', dest: 'dist/esm/css' },
      ],
      verbose: true,
    }),
  ],
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorHCECapacitorPlugin',
      globals: {
        '@capacitor/core': 'capacitorExports',
        'react': 'React',
        'react-router-dom': 'ReactRouterDOM',
        '@ionic/react': 'IonicReact',
        '@ionic/react-router': 'IonicReactRouter',
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
  
  // Completely suppress all warnings
  onwarn: () => {}
};