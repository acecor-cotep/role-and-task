'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _CONSTANT = require('../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _Utils = require('../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Errors = require('../../Utils/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
var ATask = function () {
  function ATask() {
    (0, _classCallCheck3.default)(this, ATask);

    this.name = _CONSTANT2.default.DEFAULT_TASK.ABSTRACT_TASK.name;

    this.id = _CONSTANT2.default.DEFAULT_TASK.ABSTRACT_TASK.id;

    this.active = false;

    // List of connected tasks
    this.connectedTasks = [];
  }

  /**
   * Get the name of the Task
   * @return {String}
   */


  (0, _createClass3.default)(ATask, [{
    key: 'isActive',


    /**
     * Is the Task active?
     */
    value: function isActive() {
      return this.active;
    }

    /**
     * SINGLETON implementation
     * @abstract
     */

  }, {
    key: 'gatherInfosFromTask',


    /**
     * Get some infos from the task
     */
    value: function gatherInfosFromTask() {
      return new _promise2.default(function (resolve) {
        return resolve({});
      });
    }

    /**
     * PROGRAM start to run the task
     * @param {Object} args
     * @abstract
     */

  }, {
    key: 'start',
    value: function start() {
      return new _promise2.default(function (_, reject) {
        return reject(new _Errors2.default('EXXXX', 'Unimplemented start methods in ' + _Utils2.default.getFunctionName() + ' child'));
      });
    }

    /**
     * PROGRAM stop to run the task
     * @param {Object} args
     * @abstract
     */

  }, {
    key: 'stop',
    value: function stop() {
      return new _promise2.default(function (_, reject) {
        return reject(new _Errors2.default('EXXXX', 'Unimplemented stop methods in ' + _Utils2.default.getFunctionName() + ' child'));
      });
    }

    /**
     * Connect the actual task to the given task
     * @param {String} idTaskToConnect
     * @param {Object} args
     * @abstract
     */

  }, {
    key: 'connectToTask',
    value: function connectToTask() {
      return new _promise2.default(function (_, reject) {
        return reject(new _Errors2.default('EXXXX', 'Unimplemented connectToTask methods in ' + _Utils2.default.getFunctionName() + ' child'));
      });
    }

    /**
     * apply the program state on the task
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: 'applyNewProgramState',
    value: function applyNewProgramState() {
      return new _promise2.default(function (resolve) {
        return resolve();
      });
    }

    /**
     * We get news data from here, use it or not, it depends from the task
     *
     * @param {String} dataName
     * @param {Object} data
     * @param {Date} timestamp
     */

  }, {
    key: 'consumeNewsData',
    value: function consumeNewsData() {}
    // Do not consume the data


    /**
     * Build an head/body pattern message
     * @param {String} head
     * @param {Object} body
     */

  }, {
    key: 'buildHeadBodyMessage',
    value: function buildHeadBodyMessage(head, body) {
      var _JSON$stringify2;

      return (0, _stringify2.default)((_JSON$stringify2 = {}, (0, _defineProperty3.default)(_JSON$stringify2, _CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD, head), (0, _defineProperty3.default)(_JSON$stringify2, _CONSTANT2.default.PROTOCOL_KEYWORDS.BODY, body), _JSON$stringify2));
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      return new _promise2.default(function (_, reject) {
        return reject(new _Errors2.default('EXXXX', 'Unimplemented getInstance methods in ' + _Utils2.default.getFunctionName() + ' child'));
      });
    }
  }, {
    key: 'name',
    get: function get() {
      return this.name;
    }
  }]);
  return ATask;
}(); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = ATask;
//# sourceMappingURL=ATask.js.map
