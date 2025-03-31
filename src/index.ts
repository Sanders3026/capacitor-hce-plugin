import { registerPlugin } from '@capacitor/core';
import type { HCECapacitorPluginPlugin } from './definitions';
import { default as NfcEmulation } from './App';  // Import App correctly
const HCECapacitorPlugin = registerPlugin<HCECapacitorPluginPlugin>('HCECapacitorPlugin');

export * from './definitions';
export {HCECapacitorPlugin};
export {NfcEmulation};

