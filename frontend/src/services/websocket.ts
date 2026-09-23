export type WebSocketMessage = {
  type: 'notification' | 'ping' | 'status';
  payload?: unknown;
  message?: string;
};

export class ProcurementSocket {
  private socket: WebSocket | null = null;
  private onMessageHandler: ((event: MessageEvent) => void) | null = null;

  connect(url: string, onMessage: (event: MessageEvent) => void) {
    this.onMessageHandler = onMessage;
    const wsUrl = url.replace('http', 'ws');
    this.socket = new WebSocket(wsUrl);
    this.socket.onmessage = (event) => {
      if (this.onMessageHandler) this.onMessageHandler(event);
    };
    this.socket.onopen = () => {
      this.send({ type: 'ping', message: 'connected' });
    };
    this.socket.onerror = () => {
      console.warn('WebSocket connection failed; using polling fallback.');
    };
  }

  send(message: WebSocketMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}
