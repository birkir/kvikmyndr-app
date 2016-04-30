class SettingsStore {
  constructor() {
    this.store = {
      showSynoptis: true,
    };
  }

  setStore(data) {
    this.store = data;
  }
}

const store = new SettingsStore();

export default store;
