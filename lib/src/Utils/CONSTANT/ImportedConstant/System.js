"use strict";
/* ************************************************************************************* */
/* *********************************** SYSTEM ****************************************** */
/* ************************************************************************************* */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(superclass) {
    return /** @class */ (function (_super) {
        __extends(CONSTANT, _super);
        function CONSTANT() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(CONSTANT, "TIMEOUT_LEAVE_PROGRAM_UNPROPER", {
            /**
             * Time to wait before to exit unproperly to let the system makes the displays
             */
            get: function () {
                return 200;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MAX_NUMBER_OF_LISTENER", {
            get: function () {
                return 100;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "TIMING_OF_CPU_MONITORING", {
            /**
             * time in ms between two cpu usage lookup for utilsCPUMonitoring
             */
            get: function () {
                return 300;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SIGNAL", {
            /**
             * Signals to treat (When you get them you soft QUIT)
             */
            get: function () {
                return {
                    SIGINT: 'SIGINT',
                    SIGHUP: 'SIGHUP',
                    SIGQUIT: 'SIGQUIT',
                    SIGABRT: 'SIGABRT',
                    SIGTERM: 'SIGTERM',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MAX_PORT_NUMBER", {
            /**
             * Port number is from 0 to 65535
             */
            get: function () {
                return 65535;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "PROCESS_EXCEPTION", {
            /**
             * Process exceptions to catch
             */
            get: function () {
                return 'uncaughtException';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "UNHANDLED_PROMISE_REJECTION", {
            /**
             * Process exceptions to catch
             */
            get: function () {
                return 'unhandledRejection';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "NODE_WARNING", {
            /**
             * Process warning to catch
             */
            get: function () {
                return 'warning';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SIGNAL_UNPROPER", {
            /**
             * When you get that signal QUIT not properly
             */
            get: function () {
                return {
                    SIGUSR1: 'SIGUSR1',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SIGNAL_TO_KILL_SLAVE_COMMAND", {
            /**
             * When we launch a new slave (before the connection) (master1_0)
             */
            get: function () {
                return 'SIGTERM';
            },
            enumerable: true,
            configurable: true
        });
        return CONSTANT;
    }(superclass));
}
exports.default = default_1;
