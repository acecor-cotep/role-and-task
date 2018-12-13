'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Library = require('../../src/Library.js');

var _Library2 = _interopRequireDefault(_Library);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var roleAndTask = new _Library2.default.RoleAndTask();

// Set the configuration of the library
roleAndTask.setConfiguration({
  // Mandatory
  // Where the file describing the architecture to create is
  launchMasterSlaveConfigurationFile: _path2.default.resolve(__dirname) + '/../../../test/testSimple/minimalArchitecture.hjson',

  // Where is the file we use to launch the processes (the actual file)
  pathToEntryFile: _path2.default.resolve(__dirname) + '/main.js'
});

/**
 * Subscribe to the state change and display it
 */
roleAndTask.subscribeToStateChange(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(state) {
    var role;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return roleAndTask.getSlaveNorMaster();

          case 2:
            role = _context.sent;


            if (role && role.id === _Library2.default.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
              console.log('New State : ' + state.name + '/#' + state.id);
            }

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

/**
 * Startup the whole processus launch thing
 */
roleAndTask.boot();
//# sourceMappingURL=main.js.map
