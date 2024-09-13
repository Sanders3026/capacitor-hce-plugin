import { WebPlugin } from '@capacitor/core';

import type { HCECapacitorPluginPlugin } from './definitions';

export class HCECapacitorPluginWeb
  extends WebPlugin
  implements HCECapacitorPluginPlugin
{
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
