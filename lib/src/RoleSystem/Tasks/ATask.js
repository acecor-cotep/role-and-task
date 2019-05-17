"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _CONSTANT = _interopRequireDefault(require("../../Utils/CONSTANT/CONSTANT.js"));

var _Utils = _interopRequireDefault(require("../../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../../Utils/Errors.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
var ATask =
/*#__PURE__*/
function () {
  function ATask() {
    (0, _classCallCheck2["default"])(this, ATask);
    this.name = _CONSTANT["default"].DEFAULT_TASK.ABSTRACT_TASK.name;
    this.id = _CONSTANT["default"].DEFAULT_TASK.ABSTRACT_TASK.id;
    this.active = false; // List of connected tasks

    this.connectedTasks = [];
  }
  /**
   * Get the name of the Task
   * @return {String}
   */


  (0, _createClass2["default"])(ATask, [{
    key: "isActive",

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
    key: "gatherInfosFromTask",

    /**
     * Get some infos from the task
     */
    value: function gatherInfosFromTask() {
      return new Promise(function (resolve) {
        return resolve({});
      });
    }
    /**
     * PROGRAM start to run the task
     * @param {Object} args
     * @abstract
     */

  }, {
    key: "start",
    value: function start() {
      return new Promise(function (_, reject) {
        return reject(new _Errors["default"]('EXXXX', "Unimplemented start methods in ".concat(_Utils["default"].getFunctionName(), " child")));
      });
    }
    /**
     * PROGRAM stop to run the task
     * @param {Object} args
     * @abstract
     */

  }, {
    key: "stop",
    value: function stop() {
      return new Promise(function (_, reject) {
        return reject(new _Errors["default"]('EXXXX', "Unimplemented stop methods in ".concat(_Utils["default"].getFunctionName(), " child")));
      });
    }
    /**
     * Connect the actual task to the given task
     * @param {String} idTaskToConnect
     * @param {Object} args
     * @abstract
     */

  }, {
    key: "connectToTask",
    value: function connectToTask() {
      return new Promise(function (_, reject) {
        return reject(new _Errors["default"]('EXXXX', "Unimplemented connectToTask methods in ".concat(_Utils["default"].getFunctionName(), " child")));
      });
    }
    /**
     * apply the program state on the task
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: "applyNewProgramState",
    value: function applyNewProgramState() {
      return new Promise(function (resolve) {
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
    key: "consumeNewsData",
    value: function consumeNewsData() {} // Do not consume the data

    /**
     * Build an head/body pattern message
     * @param {String} head
     * @param {Object} body
     */

  }, {
    key: "buildHeadBodyMessage",
    value: function buildHeadBodyMessage(head, body) {
      var _JSON$stringify;

      return JSON.stringify((_JSON$stringify = {}, (0, _defineProperty2["default"])(_JSON$stringify, _CONSTANT["default"].PROTOCOL_KEYWORDS.HEAD, head), (0, _defineProperty2["default"])(_JSON$stringify, _CONSTANT["default"].PROTOCOL_KEYWORDS.BODY, body), _JSON$stringify));
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new Promise(function (_, reject) {
        return reject(new _Errors["default"]('EXXXX', "Unimplemented getInstance methods in ".concat(_Utils["default"].getFunctionName(), " child")));
      });
    }
  }, {
    key: "name",
    get: function get() {
      return this.name;
    }
  }]);
  return ATask;
}();

exports["default"] = ATask;
//# sourceMappingURL=ATask.js.map
