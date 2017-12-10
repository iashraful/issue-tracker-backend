import EventEmitter from "events";

class SettingsStore extends EventEmitter {
    constructor() {
        super();

        this.allUrls = [];
    }

    setAllUrls(urls) {
        this.allUrls = urls;
        this.emit("url_change");
    }
}

const settingsStore = new SettingsStore();
export default settingsStore;