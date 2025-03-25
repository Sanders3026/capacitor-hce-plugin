import { registerPlugin } from '@capacitor/core';
import type { HCECapacitorPluginPlugin } from './definitions';
import { default as App } from './App';  // Import App correctly
import Home from './pages/Home';
const HCECapacitorPlugin = registerPlugin<HCECapacitorPluginPlugin>('HCECapacitorPlugin');

export * from './definitions';
export {HCECapacitorPlugin};
export {App}
export{Home}
