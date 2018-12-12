//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/**
 * This class contains high levels constant
 * It needs to be the root of extends in CONSTANT.es6
 */

let instance = null;

/**
 * This class is a Singleton
 */
export default function (superclass) {
  return class CONSTANT extends superclass {
    /**
     * Constructor of the singleton class
     */
    constructor() {
      if (instance) return instance;

      super();

      instance = this;

      return instance;
    }

    /**
     * Return the unique instance of the class
     */
    static getInstance() {
      return instance || new CONSTANT();
    }


    /**
     * When you want to get the function name, how many back do you go for
     */
    static get NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN() {
      return 3;
    }

    /**
     * When you want to get the function name, how many back do you go for
     */
    static get NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC() {
      return 3;
    }

    /**
     * When you want to get the function name, how many back do you go for
     */
    static get NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE() {
      return 3;
    }

    /**
     * In which mode PROGRAM is launched to by default
     * THIS DATA IS AFFECTED BY THE CONFIGURATION FILE
     */
    static get DEFAULT_LAUNCHING_MODE() {
      return CONSTANT.PROGRAM_LAUNCHING_MODE.MASTER;
    }

    /**
     * Default tasks
     */
    static get DEFAULT_TASK() {
      return {
        ABSTRACT_TASK: {
          name: 'Abstract Task',
          color: 'white',

          // -1 means not usable (need to be implemented)
          id: -1,

          idsAllowedRole: [],
        },
      };
    }

    /**
     * Default states of the system
     */
    static get DEFAULT_STATES() {
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
    }

    /**
     * Ids of the default roles
     *
     * Have to use require to avoid circular import
     */
    static get DEFAULT_ROLES() {
      const Master1_0 = require('../../../RoleSystem/Role/RoleMaster/Master1_0.js')
        .default;

      const Slave1_0 = require('../../../RoleSystem/Role/RoleSlave/Slave1_0.js')
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
          class: Master1_0,
        },

        SLAVE_ROLE: {
          name: 'Slave',
          id: 2,
          class: Slave1_0,
        },
      };
    }

    /* ************************************************************************************* */
    /* *************************** PROGRAM LAUNCHING MODE ************************************ */
    /* ************************************************************************************* */

    /**
     * Different program launching mode and the keywords to use in CLI to pick one of them
     */
    static get PROGRAM_LAUNCHING_MODE() {
      return {
        MASTER: 'master',
        SLAVE: 'slave',
      };
    }

    /**
     * Different program launching parameters
     */
    static get PROGRAM_LAUNCHING_PARAMETERS() {
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
    }

    /**
     * Options that can be passed to mode-options
     */
    static get DETAILED_MODE_OPTIONS_PARAMETERS() {
      return {
        CONFIGURATION_FILENAME: 'configurationFilename',
      };
    }

    /**
     * Path to get the main
     */
    static get PATH_TO_MAIN() {
      return 'src/systemBoot/systemBoot.js';
    }

    /* ************************************************************************************* */
    /* **************************** COMMUNICATION SYSTEM *********************************** */
    /* ************************************************************************************* */

    /**
     * Socket Communication systems that can be used on PROGRAM
     */
    static get SOCKET_COMMUNICATION_SYSTEM() {
      return {
        ABSTRACT_SOCKET_COMMUNICATION_SYSTEM: 'Abstract Communication System',
        ZEROMQ: 'ZeroMQ aka OMQ',
        SOCKETIO: 'Socket.io',
      };
    }

    /* ************************************************************************************* */
    /* ********************************* ROLE & TASKS ************************************** */
    /* ************************************************************************************* */

    /**
     * Keywords used in communication protocols between tasks
     */
    static get PROTOCOL_KEYWORDS() {
      return {
        HEAD: 'head',
        BODY: 'body',
      };
    }

    /**
     * Master/Slave messages used in theirs protocols
     */
    static get PROTOCOL_MASTER_SLAVE() {
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
    }

    /**
     * Args that are passed to a slave to start
     */
    static get SLAVE_START_ARGS() {
      return {
        IP_SERVER: 'ipServer',
        PORT_SERVER: 'portServer',
        IDENTIFIER: 'identifier',
      };
    }

    /**
     * The amount of time a master wait for a slave message before to timeout
     */
    static get MASTER_MESSAGE_WAITING_TIMEOUT() {
      return 300000;
    }

    /**
     * The amount of time a linkApi wait for an answer from calculApi before to timeout
     */
    static get WAIT_LINK_API_MESSAGE() {
      return 300000;
    }

    /**
     * The amount of time a master wait for a slave message to acknowledge the state change before to timeout
     */
    static get MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE() {
      return 300000;
    }

    /**
     * The amount of time a master wait for a slave message before to timeout
     */
    static get MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK() {
      return 300000;
    }

    /**
     * Args that are passed to a master to start
     */
    static get MASTER_START_ARGS() {
      return {
        IP_SERVER: 'ipServer',
        PORT_SERVER: 'portServer',
      };
    }

    /**
     * Tags that specify the purpose of a text to display.
     * Theses tags are used when we want to redirect the data to display
     */
    static get MESSAGE_DISPLAY_TAGS() {
      return {
        PROGRAM_STATE: 1,
        ROLE_DISPLAY: 3,
        ERROR: 4,
      };
    }

    /**
     * How many ms between we get data from all tasks and give it to master
     */
    static get SLAVES_INFOS_CHANGE_TIME() {
      return 3000;
    }

    /**
     * Say how many time between two look at CPU and memory usage for slaves and master process
     */
    static get DISPLAY_CPU_MEMORY_CHANGE_TIME() {
      return 3000;
    }

    /**
     * String that ask for a quit of PROGRAM whole system
     */
    static get QUIT() {
      return '__quit_program_order__';
    }
  };
}
