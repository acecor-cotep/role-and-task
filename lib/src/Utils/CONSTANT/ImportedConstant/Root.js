'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = function (superclass) {
  return function (_superclass) {
    (0, _inherits3.default)(CONSTANT, _superclass);

    /**
     * Constructor of the singleton class
     */
    function CONSTANT() {
      var _ret, _ret2;

      (0, _classCallCheck3.default)(this, CONSTANT);

      if (instance) return _ret = instance, (0, _possibleConstructorReturn3.default)(_this, _ret);

      var _this = (0, _possibleConstructorReturn3.default)(this, (CONSTANT.__proto__ || (0, _getPrototypeOf2.default)(CONSTANT)).call(this));

      instance = _this;

      return _ret2 = instance, (0, _possibleConstructorReturn3.default)(_this, _ret2);
    }

    /**
     * Return the unique instance of the class
     */


    (0, _createClass3.default)(CONSTANT, null, [{
      key: 'getInstance',
      value: function getInstance() {
        return instance || new CONSTANT();
      }

      /**
       * Default tasks
       */

    }, {
      key: 'DEFAULT_TASK',
      get: function get() {
        return {
          ABSTRACT_TASK: {
            name: 'Abstract Task',
            color: 'white',

            // -1 means not usable (need to be implemented)
            id: -1,

            idsAllowedRole: []
          }
        };
      }

      /**
       * Ids of the default roles
       *
       * Have to use require to avoid circular import
       */

    }, {
      key: 'DEFAULT_ROLE',
      get: function get() {
        var Master1_0 = require('../../../RoleSystem/Role/RoleMaster/Master1_0.js').default;

        var Slave1_0 = require('../../../RoleSystem/Role/RoleSlave/Slave1_0.js').default;

        return {
          ABSTRACT_ROLE: {
            name: 'Abstract Role',

            // -1 means not usable (need to be implemented)
            id: -1
          },

          ABSTRACT_MASTER_ROLE: {
            // -1 means not usable (need to be implemented)
            name: 'Abstract Master Role',

            id: -1
          },

          ABSTRACT_SLAVE_ROLE: {
            name: 'Abstract Slave Role',

            // -1 means not usable (need to be implemented)
            id: -1
          },

          MASTER_ROLE: {
            name: 'Master',
            id: 1,
            class: Master1_0
          },

          SLAVE_ROLE: {
            name: 'Slave',
            id: 2,
            class: Slave1_0
          }
        };
      }

      /**
       * The Eliot global state (what you can do depends on the actual state)
       */

    }, {
      key: 'ELIOT_STATE',
      get: function get() {
        return {
          // /!\
          //        DO NOT USE 0 VALUE DUE TO === COMPARAISONS
          // /!\
          //
          // /!\    DO NOT FORGET TO LOOK AT ASCII_ART_ELIOT_STATE_DISPLAY_CONSOLE
          //

          // ELIOT is in launching progress (launching slaves, tasks, starting servers...)
          LAUNCHING: 1,

          // ELIOT is in an checking phase (look at database integrity, collections consistency...)
          CHECKING_AND_HEAL: 2,

          // We want to do something on the database, the system must be in particular position
          DATABASE_MAINTAINANCE: 3,

          // The system is ready to get started (waiting the IN_PRODUCTION to come)
          READY: 4,

          // The system is running
          IN_PRODUCTION: 5,

          // The system got an error
          ERROR: 6,

          // The system have to close
          CLOSE: 7
        };
      }

      /**
       * Translate the eliot state
       */

    }, {
      key: 'ELIOT_STATE_TRANSLATION',
      get: function get() {
        var _ref;

        return _ref = {}, (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.LAUNCHING, 'Launching'), (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.CHECKING_AND_HEAL, 'Checking and heal'), (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.DATABASE_MAINTAINANCE, 'Database maintainance'), (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.READY, 'Ready'), (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.IN_PRODUCTION, 'in production'), (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.ERROR, 'Error'), (0, _defineProperty3.default)(_ref, CONSTANT.ELIOT_STATE.CLOSE, 'Close'), _ref;
      }

      /* ************************************************************************************* */
      /* *************************** ELIOT LAUNCHING MODE ************************************ */
      /* ************************************************************************************* */

      /**
       * Different eliot launching mode and the keywords to use in CLI to pick one of them
       */

    }, {
      key: 'ELIOT_LAUNCHING_MODE',
      get: function get() {
        return {
          MASTER: 'master',
          SLAVE: 'slave'
        };
      }

      /**
       * Different eliot launching parameters
       */

    }, {
      key: 'ELIOT_LAUNCHING_PARAMETERS',
      get: function get() {
        return {
          MODE: {
            name: 'mode',
            alias: 'm'
          },

          MODE_OPTIONS: {
            name: 'mode-options',
            alias: 'o'
          }
        };
      }

      /**
       * Options that can be passed to mode-options
       */

    }, {
      key: 'DETAILED_MODE_OPTIONS_PARAMETERS',
      get: function get() {
        return {
          CONFIGURATION_FILENAME: 'configurationFilename'
        };
      }

      /**
       * Path to get the main
       */

    }, {
      key: 'PATH_TO_MAIN',
      get: function get() {
        return 'src/systemBoot/systemBoot.js';
      }

      /* ************************************************************************************* */
      /* **************************** COMMUNICATION SYSTEM *********************************** */
      /* ************************************************************************************* */

      /**
       * Socket Communication systems that can be used on ELIOT
       */

    }, {
      key: 'SOCKET_COMMUNICATION_SYSTEM',
      get: function get() {
        return {
          ABSTRACT_SOCKET_COMMUNICATION_SYSTEM: 'Abstract Communication System',
          ZEROMQ: 'ZeroMQ aka OMQ',
          SOCKETIO: 'Socket.io'
        };
      }

      /* ************************************************************************************* */
      /* ********************************* ROLE & TASKS ************************************** */
      /* ************************************************************************************* */

      /**
       * Keywords used in communication protocols between tasks
       */

    }, {
      key: 'PROTOCOL_KEYWORDS',
      get: function get() {
        return {
          HEAD: 'head',
          BODY: 'body'
        };
      }

      /**
       * The data that are news
       */

    }, {
      key: 'GENERIC_DATA_NEWS',
      get: function get() {
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
          NOTIFY_DISPLAY_CONFIGURATION_CHANGE: 'display_configuration_changed'
        };
      }

      /**
       * Master/Slave messages used in theirs protocols
       */

    }, {
      key: 'PROTOCOL_MASTER_SLAVE',
      get: function get() {
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
            CHANGE_DATABASE_CONNECTION: 'dbcon'
          }
        };
      }

      /**
       * Args that are passed to a slave to start
       */

    }, {
      key: 'SLAVE_START_ARGS',
      get: function get() {
        return {
          IP_SERVER: 'ipServer',
          PORT_SERVER: 'portServer',
          IDENTIFIER: 'identifier'
        };
      }

      /**
       * The amount of time a master wait for a slave message before to timeout
       */

    }, {
      key: 'MASTER_MESSAGE_WAITING_TIMEOUT',
      get: function get() {
        return CONSTANT.getInstance().masterMessageWaitingTimeout || 300000;
      }

      /**
       * The amount of time a linkApi wait for an answer from calculApi before to timeout
       */

    }, {
      key: 'WAIT_LINK_API_MESSAGE',
      get: function get() {
        return CONSTANT.getInstance().waitLinkApiMessage || 300000;
      }

      /**
       * The amount of time a master wait for a slave message to acknowledge the state change before to timeout
       */

    }, {
      key: 'MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE',
      get: function get() {
        return CONSTANT.getInstance().masterMessageWaitingTimeoutStateChange || 300000;
      }

      /**
       * The amount of time a master wait for a slave message before to timeout
       */

    }, {
      key: 'MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK',
      get: function get() {
        return CONSTANT.getInstance().masterMessageWaitingTimeoutStopTask || 300000;
      }

      /**
       * Args that are passed to a master to start
       */

    }, {
      key: 'MASTER_START_ARGS',
      get: function get() {
        return {
          IP_SERVER: 'ipServer',
          PORT_SERVER: 'portServer'
        };
      }

      /**
       * Tags that specify the purpose of a text to display.
       * Theses tags are used when we want to redirect the data to display
       */

    }, {
      key: 'MESSAGE_DISPLAY_TAGS',
      get: function get() {
        return {
          ELIOT_STATE: 1,
          DB_INITIALIZATION: 2,
          DB_INITIALIZATION_PERCENTAGE: 3,
          ROLE_DISPLAY: 3,
          ERROR: 4,
          SYSTEM_CHECKING: 5,
          SYSTEM_HEALING: 6
        };
      }

      /**
       * How many ms between we get data from all tasks and give it to master
       */

    }, {
      key: 'SLAVES_INFOS_CHANGE_TIME',
      get: function get() {
        return 3000;
      }

      /**
       * Say how many time between two look at CPU and memory usage for slaves and master process
       */

    }, {
      key: 'DISPLAY_CPU_MEMORY_CHANGE_TIME',
      get: function get() {
        return CONSTANT.getInstance().activateConsoleDisplayMode ? false : 3000;
      }

      /**
       * String that ask for a quit of ELIOT whole system
       */

    }, {
      key: 'QUIT',
      get: function get() {
        return '__quit_eliot_order__';
      }
    }]);
    return CONSTANT;
  }(superclass);
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/**
 * This class contains high levels constant
 * It needs to be the root of extends in CONSTANT.es6
 */

var instance = null;

/**
 * This class is a Singleton
 */
//# sourceMappingURL=Root.js.map
