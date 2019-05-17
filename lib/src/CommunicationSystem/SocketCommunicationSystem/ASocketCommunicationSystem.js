"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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
 * This abstract class described what a socket communication system class must offer
 */
var ASocketCommunicationSystem =
/*#__PURE__*/
function () {
  function ASocketCommunicationSystem() {
    (0, _classCallCheck2["default"])(this, ASocketCommunicationSystem);
    // Setup a name
    this.name = _CONSTANT["default"].SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM; // Say the communication system is not active

    this.active = false; // Function that get called when a new message get received

    this.incomingMessageListeningFunction = [];
  }
  /**
   * Getter
   * @return {String}
   */


  (0, _createClass2["default"])(ASocketCommunicationSystem, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
    /**
     * Setter
     * @param {String} name
     */

  }, {
    key: "setName",
    value: function setName(name) {
      this.name = name;
    }
    /**
     * Return an object that can be used to act the communication system
     * @abstract
     */

  }, {
    key: "getSocket",
    value: function getSocket() {
      throw new _Errors["default"]("Unimplemented getSocket methods in ".concat(_Utils["default"].getFunctionName(), " child"));
    }
    /**
     * Start the communication system
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
     * Stop the communication system
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
     * Is the communication sytem active?
     * @return {Boolean}
     */

  }, {
    key: "isActive",
    value: function isActive() {
      return this.active;
    }
    /**
     * Send a message
     * @abstract
     */

  }, {
    key: "sendMessage",
    value: function sendMessage() {
      throw new _Errors["default"]('EXXXX', "Unimplemented sendMessage methods in ".concat(_Utils["default"].getFunctionName(), " child"));
    }
    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     * @param {Object} context
     */

  }, {
    key: "listenToIncomingMessage",
    value: function listenToIncomingMessage(func, context) {
      this.incomingMessageListeningFunction.push({
        func: func,
        context: context
      });
    }
    /**
     * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     */

  }, {
    key: "unlistenToIncomingMessage",
    value: function unlistenToIncomingMessage(func) {
      this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(function (x) {
        return x.func !== func;
      });
    }
  }]);
  return ASocketCommunicationSystem;
}();

exports["default"] = ASocketCommunicationSystem;
//# sourceMappingURL=ASocketCommunicationSystem.js.map
