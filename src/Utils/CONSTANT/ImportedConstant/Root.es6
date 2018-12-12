//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/**
 * This class contains high levels constant
 * It needs to be the root of extends in CONSTANT.es6
 */

import colors from 'colors';

import Utils from '../../Utils.js';

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
     * In which mode ELIOT is launched to by default
     * THIS DATA IS AFFECTED BY THE CONFIGURATION FILE
     */
    static get DEFAULT_LAUNCHING_MODE() {
      return CONSTANT.ELIOT_LAUNCHING_MODE.MASTER;
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

        // ELIOT is in launching progress (launching slaves, tasks, starting servers...)
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
    static get DEFAULT_ROLE() {
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
    /* *************************** ELIOT LAUNCHING MODE ************************************ */
    /* ************************************************************************************* */

    /**
     * Different eliot launching mode and the keywords to use in CLI to pick one of them
     */
    static get ELIOT_LAUNCHING_MODE() {
      return {
        MASTER: 'master',
        SLAVE: 'slave',
      };
    }

    /**
     * Different eliot launching parameters
     */
    static get ELIOT_LAUNCHING_PARAMETERS() {
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
     * Socket Communication systems that can be used on ELIOT
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
     * The data that are news
     */
    static get GENERIC_DATA_NEWS() {
      return {
        // News about a collection CRUD that happended
        COLLECTION_CRUD: 'collection_crud',

        // Some news about a screen status
        SCREEN_STATUS_NEWS: 'screen_status_news',

        // Some news about some parameter status
        BREAKDOWN_PARAMETER_NEWS: 'breakdown_parameters_news',

        // There is some command to execute on objects
        NEW_COMMAND_FOR_OBJ: 'new_command_for_obj',

        // We need some iot to disconnect
        ASK_DISCONNECT_IOT: 'ask_disconnect_iot',

        // Ask for a view to get calculed
        ASK_VIEW_CALCULATION: 'ask_view_calculation',

        // An IOT get connected
        IOT_CONNECTION_EVENT: 'iot_connection_event',

        // An IOT get disconnected
        IOT_DISCONNECTION_EVENT: 'iot_disconnection_event',

        // We are interested about connected object screenshots
        NOTIFY_INTEREST_INTO_IOT_SCREENSHOT: 'iot_screenshot_interest',

        // We export new data
        NEW_EXPORT_CONNECT_OBJECT_LAST_VALUE: 'new_export_connected_object_last_value',

        // We epurate exported old files
        EPURATE_CONNECT_OBJECT_LAST_VALUE_EXPORT: 'epurate_connected_object_last_value_export',

        // We export new data
        NEW_EXPORT_CONNECT_OBJECT_DISPONIBILITY_TIME: 'new_export_connected_object_disponibility_time',

        // We want to stop the calculation
        CANCEL_DATA_EXPORT: 'cancel_data_export',

        // We export new data
        NEW_IMPORT: 'new_import',

        // We export new data
        NOTIFY_DISPLAY_CONFIGURATION_CHANGE: 'display_configuration_changed',
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

          // We declare having changed the state of ELIOT (launching, ready...)
          STATE_CHANGE: 's_ch',

          // We send data throught a generic channel
          GENERIC_CHANNEL_DATA: 'gen_d',

          // We send text from slave to master - to display it
          OUTPUT_TEXT: 'txt',

          // Slaves send theirs infos to the master
          INFOS_ABOUT_SLAVES: 'sl_i',

          // An error happened on a slave -> It tells the master
          ERROR_HAPPENED: 'error_happened',

          // A Slave ask the master to initialize the database
          // The master can answer no
          ASK_DB_INIT: 'adi',

          // A Slave tell the master the DBInitialization finished
          DB_INIT_DONE: 'dbid',

          // A Slave ask the master to update the database (startup)
          // Ask for connection change
          ASK_DATABASE_CONNECTION_CHANGE: 'asbchan',

          // Change the database connection
          CHANGE_DATABASE_CONNECTION: 'dbcon',
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
      return CONSTANT.getInstance()
        .masterMessageWaitingTimeout || 300000;
    }

    /**
     * The amount of time a linkApi wait for an answer from calculApi before to timeout
     */
    static get WAIT_LINK_API_MESSAGE() {
      return CONSTANT.getInstance()
        .waitLinkApiMessage || 300000;
    }

    /**
     * The amount of time a master wait for a slave message to acknowledge the state change before to timeout
     */
    static get MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE() {
      return CONSTANT.getInstance()
        .masterMessageWaitingTimeoutStateChange || 300000;
    }

    /**
     * The amount of time a master wait for a slave message before to timeout
     */
    static get MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK() {
      return CONSTANT.getInstance()
        .masterMessageWaitingTimeoutStopTask || 300000;
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
        ELIOT_STATE: 1,
        DB_INITIALIZATION: 2,
        DB_INITIALIZATION_PERCENTAGE: 3,
        ROLE_DISPLAY: 3,
        ERROR: 4,
        SYSTEM_CHECKING: 5,
        SYSTEM_HEALING: 6,
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
      return CONSTANT.getInstance()
        .activateConsoleDisplayMode ? false : 3000;
    }

    /**
     * String that ask for a quit of ELIOT whole system
     */
    static get QUIT() {
      return '__quit_eliot_order__';
    }

    /**
     * Return the size of a regular line in the console
     */
    static get CONSOLE_SIZE_OF_REGULAR_LINE() {
      return CONSTANT.getInstance()
        .consoleSizeOfStandardLine || 75;
    }

    /**
     * Console typical line
     */
    static get CONSOLE_REGULAR_LINE() {
      // Use a tricks to only calcul it once
      if (!CONSTANT.getInstance()
        .storeStaticRegularLine) {
        CONSTANT.getInstance()
          .storeStaticRegularLine =
          `${Utils.generateStringFromSameChar(
          CONSTANT.CONSOLE_SEPARATOR_CHAR,
         CONSTANT.CONSOLE_SIZE_OF_REGULAR_LINE,
        )}\n`;
      }

      return CONSTANT.getInstance()
        .storeStaticRegularLine;
    }

    /**
     * Which colors are displayble into the console?
     */
    static get CONSOLE_VALID_COLORS() {
      return [
        'black',
        'red',
        'green',
        'yellow',
        'blue',
        'magenta',
        'cyan',
        'white',
        'gray',
        'grey',
      ];
    }

    /**
     * The character use to construct the lines displayed into console
     */
    static get CONSOLE_SEPARATOR_CHAR() {
      return '@';
    }

    /**
     * Console colors
     */
    static get CONSOLE_MAJOR_COLOR() {
      return colors.blue;
    }

    /**
     * Console colors
     */
    static get CONSOLE_MINOR_COLOR() {
      return colors.grey;
    }

    /**
     * Console colors
     */
    static get CONSOLE_SPECIAL_COLOR() {
      return colors.cyan.bold;
    }
  };
}
