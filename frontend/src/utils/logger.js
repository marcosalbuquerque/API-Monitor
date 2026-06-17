import { dynatrace } from "./dynatrace";

class Logger {
  info(message, pushToDynatrace = false) {
    console.info(`[INFO]: ${message}`);
    if (pushToDynatrace) {
      dynatrace.sendEvent(message);
    }
  }

  warn(message) {
    console.warn(`[WARN]: ${message}`);
  }

  error(message, errorObj = null) {
    console.error(`[ERROR]: ${message}`, errorObj);
    dynatrace.reportError(errorObj, message);
  }

  debug(message, data = null) {
    console.debug(`[DEBUG]: ${message}`, data || "");
  }

  async trackAction(actionName, actionCallback, actionType = "Custom Action") {
    console.log(`[ACTION START]: ${actionName}`);
    const actionId = dynatrace.enterAction(actionName, actionType);
    
    try {
      const result = await actionCallback();
      return result;
    } catch (error) {
      this.error(`Failed during action: ${actionName}`, error);
      throw error;
    } finally {
      console.log(`[ACTION END]: ${actionName}`);
      dynatrace.leaveAction(actionId);
    }
  }
}

export const logger = new Logger();