/**
 * WebSocket Websocket連線相關
 */
const state = {
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
  },
};
type WebSocketState = typeof state;

const getters = {
  isConnected: (st: WebSocketState) => st.socket.isConnected,
};

const mutations = {
  onOpen(st: WebSocketState, event: Event) {
    st.socket.isConnected = true;
  },
  onClose(st: WebSocketState, event: Event) {
    st.socket.isConnected = false;
  },
  onError(st: WebSocketState, event: Event) {},
  // default handler called for all methods
  onMessage(st: WebSocketState, message: string) {
    st.socket.message = message;
  },
  // mutations for reconnect methods
  reconnect(st: WebSocketState, count: number) {},
  reconnectError(st: WebSocketState) {
    st.socket.reconnectError = true;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
