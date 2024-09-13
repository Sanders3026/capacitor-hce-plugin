export interface HCECapacitorPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
