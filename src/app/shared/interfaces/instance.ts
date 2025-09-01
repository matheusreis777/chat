export interface Instance {
  instance: InstanceData;
  hash: string;
  webhook: Record<string, any>; // se precisar, pode tipar melhor depois
  websocket: Record<string, any>;
  rabbitmq: Record<string, any>;
  sqs: Record<string, any>;
  settings: Settings;
  qrcode: QrCode;
}

export interface InstanceData {
  instanceName: string;
  instanceId: string;
  integration: string;
  webhookWaBusiness: string | null;
  accessTokenWaBusiness: string;
  status: string;
}

export interface Settings {
  rejectCall: boolean;
  msgCall: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
}

export interface QrCode {
  base64: string | null;
  pairingCode: string | null;
  code: string;
  count: number;
}
