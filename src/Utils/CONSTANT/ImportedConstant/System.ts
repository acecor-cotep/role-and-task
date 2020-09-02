/* ************************************************************************************* */
/* *********************************** SYSTEM ****************************************** */
/* ************************************************************************************* */

export default function (superclass: any) {
  return class CONSTANT extends superclass {
    /**
     * Time to wait before to exit unproperly to let the system makes the displays
     */
    public static get TIMEOUT_LEAVE_PROGRAM_UNPROPER() {
      return 200;
    }

    public static get MAX_NUMBER_OF_LISTENER() {
      return 100;
    }

    /**
     * time in ms between two cpu usage lookup for utilsCPUMonitoring
     */
    public static get TIMING_OF_CPU_MONITORING() {
      return 300;
    }

    /**
     * Signals to treat (When you get them you soft QUIT)
     */
    public static get SIGNAL() {
      return {
        SIGINT: 'SIGINT',
        SIGHUP: 'SIGHUP',
        SIGQUIT: 'SIGQUIT',
        SIGABRT: 'SIGABRT',
        SIGTERM: 'SIGTERM',
      };
    }

    /**
     * Port number is from 0 to 65535
     */
    public static get MAX_PORT_NUMBER() {
      return 65535;
    }

    /**
     * Process exceptions to catch
     */
    public static get PROCESS_EXCEPTION() {
      return 'uncaughtException';
    }

    /**
     * Process exceptions to catch
     */
    public static get UNHANDLED_PROMISE_REJECTION() {
      return 'unhandledRejection';
    }

    /**
     * Process warning to catch
     */
    public static get NODE_WARNING() {
      return 'warning';
    }

    /**
     * When you get that signal QUIT not properly
     */
    public static get SIGNAL_UNPROPER() {
      return {
        SIGUSR1: 'SIGUSR1',
      };
    }

    /**
     * When we launch a new slave (before the connection) (master1_0)
     */
    public static get SIGNAL_TO_KILL_SLAVE_COMMAND() {
      return 'SIGTERM';
    }
  };
}
