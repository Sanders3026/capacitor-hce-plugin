import { registerPlugin } from '@capacitor/core';

import type { HCECapacitorPluginPlugin } from './definitions';

const HCECapacitorPlugin = registerPlugin<HCECapacitorPluginPlugin>(
  'HCECapacitorPlugin',
  {
    web: () => import('./web').then(m => new m.HCECapacitorPluginWeb()),
  },
);

export * from './definitions';
export { HCECapacitorPlugin };
