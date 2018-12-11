'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This abstract class described what a socket communication system class must offer
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var ASocketCommunicationSystem = function () {
  function ASocketCommunicationSystem() {
    (0, _classCallCheck3.default)(this, ASocketCommunicationSystem);

    // Setup a name
    this.name = _CONSTANT2.default.SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM;

    // Say the communication system is not active
    this.active = false;

    // Function that get called when a new message get received
    this.incomingMessageListeningFunction = [];
  }

  /**
   * Getter
   * @return {String}
   */


  (0, _createClass3.default)(ASocketCommunicationSystem, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * Setter
     * @param {String} name
     */

  }, {
    key: 'setName',
    value: function setName(name) {
      this.name = name;
    }

    /**
     * Return an object that can be used to act the communication system
     * @abstract
     */

  }, {
    key: 'getSocket',
    value: function getSocket() {
      throw new Error('Unimplemented getSocket methods in ' + _Utils2.default.getFunctionName() + ' child');
    }

    /**
     * Start the communication system
     * @abstract
     */

  }, {
    key: 'start',
    value: function start() {
      return new _promise2.default(function (_, reject) {
        return reject(new Error('Unimplemented start methods in ' + _Utils2.default.getFunctionName() + ' child'));
      });
    }

    /**
     * Stop the communication system
     * @abstract
     */

  }, {
    key: 'stop',
    value: function stop() {
      return new _promise2.default(function (_, reject) {
        return reject(new Error('Unimplemented stop methods in ' + _Utils2.default.getFunctionName() + ' child'));
      });
    }

    /**
     * Is the communication sytem active?
     * @return {Boolean}
     */

  }, {
    key: 'isActive',
    value: function isActive() {
      return this.active;
    }

    /**
     * Send a message
     * @abstract
     */

  }, {
    key: 'sendMessage',
    value: function sendMessage() {
      throw new Error('Unimplemented sendMessage methods in ' + _Utils2.default.getFunctionName() + ' child');
    }

    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     * @param {Object} context
     */

  }, {
    key: 'listenToIncomingMessage',
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
    key: 'unlistenToIncomingMessage',
    value: function unlistenToIncomingMessage(func) {
      this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(function (x) {
        return x.func !== func;
      });
    }
  }]);
  return ASocketCommunicationSystem;
}();

exports.default = ASocketCommunicationSystem;
//# sourceMappingURL=ASocketCommunicationSystem.js.map
