import { registerPlugin } from '@capacitor/core';
import type { HCECapacitorPluginPlugin } from './definitions';

const HCECapacitorPlugin = registerPlugin<HCECapacitorPluginPlugin>('HCECapacitorPlugin');

export * from './definitions';
export { HCECapacitorPlugin };
