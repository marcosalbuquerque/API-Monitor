export const dynatrace = {
  get dtrum() {
    return window.dtrum;
  },

  isAvailable() {
    return typeof this.dtrum !== "undefined";
  },

  reportError(error, message) {
    if (this.isAvailable()) {
      this.dtrum.reportError(error instanceof Error ? error : new Error(message || String(error)));
    }
  },

  sendEvent(eventName) {
    if (this.isAvailable()) {
      this.dtrum.sendCustomEvent(eventName);
    }
  },

  enterAction(actionName, actionType = "Custom Action") {
    if (this.isAvailable()) {
      return this.dtrum.enterAction(actionName, actionType);
    }
    return null;
  },

  leaveAction(actionId) {
    if (this.isAvailable() && actionId !== null) {
      this.dtrum.leaveAction(actionId);
    }
  }
};