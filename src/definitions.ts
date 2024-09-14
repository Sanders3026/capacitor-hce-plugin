export interface HCECapacitorPluginPlugin {
  startNfcHce(options: { content: string, mimeType?: string, persistMessage?: boolean }): Promise<{ success: boolean }>;
  stopNfcHce(): Promise<{ success: boolean }>;
  isNfcSupported(): Promise<{ supported: boolean }>;
  isNfcEnabled(): Promise<{ enabled: boolean }>;
  isNfcHceSupported(): Promise<{ supported: boolean }>;
  isSecureNfcEnabled(): Promise<{ enabled: boolean }>;
  enableApduService(options: { enable: boolean }): Promise<{ enabled: boolean }>;
}
