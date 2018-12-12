'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
       * When you want to get the function name, how many back do you go for
       */

    }, {
      key: 'NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN',
      get: function get() {
        return 3;
      }

      /**
       * When you want to get the function name, how many back do you go for
       */

    }, {
      key: 'NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC',
      get: function get() {
        return 3;
      }

      /**
       * When you want to get the function name, how many back do you go for
       */

    }, {
      key: 'NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE',
      get: function get() {
        return 3;
      }

      /**
       * In which mode ELIOT is launched to by default
       * THIS DATA IS AFFECTED BY THE CONFIGURATION FILE
       */

    }, {
      key: 'DEFAULT_LAUNCHING_MODE',
      get: function get() {
        return CONSTANT.ELIOT_LAUNCHING_MODE.MASTER;
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
       * Default states of the system
       */

    }, {
      key: 'DEFAULT_STATES',
      get: function get() {
        return {
          // /!\ DO NOT USE 0 VALUE DUE TO === COMPARAISONS

          // ELIOT is in launching progress (launching slaves, tasks, starting servers...)
          LAUNCHING: {
            name: 'Launching',
            id: 1
          },

          // The system is ready in term of Role & Task started and connected
          READY_PROCESS: {
            name: 'Ready process',
            id: 2
          },

          // The system got an error
          ERROR: {
            name: 'Error',
            id: 3
          },

          // The system have to close
          CLOSE: {
            name: 'Close',
            id: 4
          }
        };
      }

      /**
       * Ids of the default roles
       *
       * Have to use require to avoid circular import
       */

    }, {
      key: 'DEFAULT_ROLES',
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

            // Ask to get the mutex behind specified id
            TAKE_MUTEX: 'a_mutex',

            // Release the mutex so It can be taken again
            RELEASE_MUTEX: 'r_mutex'
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
        return 300000;
      }

      /**
       * The amount of time a linkApi wait for an answer from calculApi before to timeout
       */

    }, {
      key: 'WAIT_LINK_API_MESSAGE',
      get: function get() {
        return 300000;
      }

      /**
       * The amount of time a master wait for a slave message to acknowledge the state change before to timeout
       */

    }, {
      key: 'MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE',
      get: function get() {
        return 300000;
      }

      /**
       * The amount of time a master wait for a slave message before to timeout
       */

    }, {
      key: 'MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK',
      get: function get() {
        return 300000;
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
          ROLE_DISPLAY: 3,
          ERROR: 4
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
        return 3000;
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
