const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

class MockBroadcastChannel {
  postMessage() {}
  onmessage() {}
}
Object.defineProperty(globalThis, 'BroadcastChannel', { value: MockBroadcastChannel });
