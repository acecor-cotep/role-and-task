"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
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
/**
 * This class contains high levels constant
 * It needs to be the root of extends in CONSTANT.es6
 */
var instance = null;
/**
 * This class is a Singleton
 */
function default_1(superclass) {
    return /** @class */ (function (_super) {
        __extends(CONSTANT, _super);
        /**
         * Constructor of the singleton class
         */
        function CONSTANT() {
            var _this = this;
            if (instance) {
                return instance;
            }
            _this = _super.call(this) || this;
            instance = _this;
            return instance;
        }
        CONSTANT.getInstance = function () {
            return instance || new CONSTANT();
        };
        Object.defineProperty(CONSTANT, "NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN", {
            /**
             * When you want to get the function name, how many back do you go for
             */
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC", {
            /**
             * When you want to get the function name, how many back do you go for
             */
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE", {
            /**
             * When you want to get the function name, how many back do you go for
             */
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "DEFAULT_LAUNCHING_MODE", {
            /**
             * In which mode PROGRAM is launched to by default
             * THIS DATA IS AFFECTED BY THE CONFIGURATION FILE
             */
            get: function () {
                return CONSTANT.PROGRAM_LAUNCHING_MODE.MASTER;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "DEFAULT_TASK", {
            get: function () {
                return {
                    ABSTRACT_TASK: {
                        name: 'Abstract Task',
                        color: 'white',
                        // -1 means not usable (need to be implemented)
                        id: -1,
                        idsAllowedRole: [],
                    },
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "DEFAULT_STATES", {
            /**
             * Default states of the system
             */
            get: function () {
                return {
                    // /!\ DO NOT USE 0 VALUE DUE TO === COMPARAISONS
                    // PROGRAM is in launching progress (launching slaves, tasks, starting servers...)
                    LAUNCHING: {
                        name: 'Launching',
                        id: 1,
                    },
                    // The system is ready in term of Role & Task started and connected
                    READY_PROCESS: {
                        name: 'Ready process',
                        id: 2,
                    },
                    // The system got an error
                    ERROR: {
                        name: 'Error',
                        id: 3,
                    },
                    // The system have to close
                    CLOSE: {
                        name: 'Close',
                        id: 4,
                    },
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "DEFAULT_ROLES", {
            /**
             * Ids of the default roles
             *
             * Have to use require to avoid circular import
             */
            get: function () {
                var Master = require('../../../RoleSystem/Role/RoleMaster/Master.js')
                    .default;
                var Slave = require('../../../RoleSystem/Role/RoleSlave/Slave.js')
                    .default;
                return {
                    ABSTRACT_ROLE: {
                        name: 'Abstract Role',
                        // -1 means not usable (need to be implemented)
                        id: -1,
                    },
                    ABSTRACT_MASTER_ROLE: {
                        // -1 means not usable (need to be implemented)
                        name: 'Abstract Master Role',
                        id: -1,
                    },
                    ABSTRACT_SLAVE_ROLE: {
                        name: 'Abstract Slave Role',
                        // -1 means not usable (need to be implemented)
                        id: -1,
                    },
                    MASTER_ROLE: {
                        name: 'Master',
                        id: 1,
                        class: Master,
                    },
                    SLAVE_ROLE: {
                        name: 'Slave',
                        id: 2,
                        class: Slave,
                    },
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "PROGRAM_LAUNCHING_MODE", {
            /* ************************************************************************************* */
            /* *************************** PROGRAM LAUNCHING MODE ************************************ */
            /* ************************************************************************************* */
            /**
             * Different program launching mode and the keywords to use in CLI to pick one of them
             */
            get: function () {
                return {
                    MASTER: 'master',
                    SLAVE: 'slave',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "PROGRAM_LAUNCHING_PARAMETERS", {
            get: function () {
                return {
                    MODE: {
                        name: 'mode',
                        alias: 'm',
                    },
                    MODE_OPTIONS: {
                        name: 'mode-options',
                        alias: 'o',
                    },
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "PATH_TO_MAIN", {
            get: function () {
                return 'src/systemBoot/systemBoot.js';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SOCKET_COMMUNICATION_SYSTEM", {
            /* ************************************************************************************* */
            /* **************************** COMMUNICATION SYSTEM *********************************** */
            /* ************************************************************************************* */
            /**
             * Socket Communication systems that can be used on PROGRAM
             */
            get: function () {
                return {
                    ABSTRACT_SOCKET_COMMUNICATION_SYSTEM: 'Abstract Communication System',
                    ZEROMQ: 'ZeroMQ aka OMQ',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "PROTOCOL_KEYWORDS", {
            /* ************************************************************************************* */
            /* ********************************* ROLE & TASKS ************************************** */
            /* ************************************************************************************* */
            /**
             * Keywords used in communication protocols between tasks
             */
            get: function () {
                return {
                    HEAD: 'head',
                    BODY: 'body',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "PROTOCOL_MASTER_SLAVE", {
            /**
             * Master/Slave messages used in theirs protocols
             */
            get: function () {
                return {
                    // Full messages that are exchanged like that master->client and used as head by client
                    MESSAGES: {
                        // We close the slave
                        CLOSE: 'clo_s',
                        // We list the tasks that are launched & the type of slave
                        SLAVE_CONFIRMATION_INFORMATIONS: 'l_c_i',
                        // Ask for a listing of tasks
                        LIST_TASKS: 'list_t',
                        // We connect two task together
                        CONNECT_TASK_TO_TASK: 'con_t_t',
                        // We start a task
                        START_TASK: 'star_ta',
                        // We stop a task
                        STOP_TASK: 'sto_ta',
                        // We declare having changed the state of PROGRAM (launching, ready...)
                        STATE_CHANGE: 's_ch',
                        // We send data throught a generic channel
                        GENERIC_CHANNEL_DATA: 'gen_d',
                        // We send text from slave to master - to display it
                        OUTPUT_TEXT: 'txt',
                        // Slaves send theirs infos to the master
                        INFOS_ABOUT_SLAVES: 'sl_i',
                        // An error happened on a slave -> It tells the master
                        ERROR_HAPPENED: 'error_happened',
                        // Ask to get the mutex behind specified id
                        TAKE_MUTEX: 'a_mutex',
                        // Release the mutex so It can be taken again
                        RELEASE_MUTEX: 'r_mutex',
                    },
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SLAVE_START_ARGS", {
            /**
             * Args that are passed to a slave to start
             */
            get: function () {
                return {
                    IP_SERVER: 'ipServer',
                    PORT_SERVER: 'portServer',
                    IDENTIFIER: 'identifier',
                    ELIOT_START_TIME: 'eliotStartTime',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MASTER_MESSAGE_WAITING_TIMEOUT", {
            /**
             * The amount of time a master wait for a slave message before to timeout
             */
            get: function () {
                return 300000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "WAIT_LINK_API_MESSAGE", {
            /**
             * The amount of time a linkApi wait for an answer from calculApi before to timeout
             */
            get: function () {
                return 300000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "CONSIDER_WARNING_AS_ERRORS", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MAKES_ERROR_FATAL", {
            /**
             * Makes error fatal, which means we are exiting instead of getting into ERROR mode
             */
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE", {
            /**
             * The amount of time a master wait for a slave message to acknowledge the state change before to timeout
             */
            get: function () {
                return 300000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK", {
            /**
             * The amount of time a master wait for a slave message before to timeout
             */
            get: function () {
                return 300000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MASTER_START_ARGS", {
            get: function () {
                return {
                    IP_SERVER: 'ipServer',
                    PORT_SERVER: 'portServer',
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "MESSAGE_DISPLAY_TAGS", {
            /**
             * Tags that specify the purpose of a text to display.
             * Theses tags are used when we want to redirect the data to display
             */
            get: function () {
                return {
                    PROGRAM_STATE: 1,
                    ROLE_DISPLAY: 3,
                    ERROR: 4,
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SLAVES_INFOS_CHANGE_TIME", {
            /**
             * How many ms between we get data from all tasks and give it to master
             */
            get: function () {
                return 3000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "DISPLAY_CPU_MEMORY_CHANGE_TIME", {
            /**
             * Say how many time between two look at CPU and memory usage for slaves and master process
             */
            get: function () {
                return 3000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "QUIT", {
            /**
             * String that ask for a quit of PROGRAM whole system
             */
            get: function () {
                return '__quit_program_order__';
            },
            enumerable: true,
            configurable: true
        });
        return CONSTANT;
    }(superclass));
}
exports.default = default_1;
