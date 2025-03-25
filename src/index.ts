import { registerPlugin } from '@capacitor/core';
import type { HCECapacitorPluginPlugin } from './definitions';
import App from './App';
const HCECapacitorPlugin = registerPlugin<HCECapacitorPluginPlugin>('HCECapacitorPlugin');

export * from './definitions';
export { HCECapacitorPlugin,App };
