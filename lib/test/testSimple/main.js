'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _Utils = require('../../src/Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Library = require('../../src/Library.js');

var _Library2 = _interopRequireDefault(_Library);

var _SimpleTask = require('./SimpleTask.js');

var _SimpleTask2 = _interopRequireDefault(_SimpleTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roleAndTask = new _Library2.default.RoleAndTask();

// Attach a color to the pid so you can easily identify it and see that there are 3 processes
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var colorsArray = ['yellow', 'red', 'blue', 'cyan', 'red', 'magenta', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'rainbow', 'america', 'trap'];

var colorToUse = colorsArray[_Utils2.default.generateRandom(0, colorsArray.length - 1)];

var processPid = _colors2.default[colorToUse](String(process.pid));

// Store the string in global so it can be used in the Task runned in the process
global.processPid = processPid;

console.log('\n > ################################################\n >        Run TestSimple : Process ' + processPid + '\n >        Use : Ctrl + C to leave\n > ################################################\n\n');

// Declare the Task
roleAndTask.declareTask({
  name: 'SimpleTask',

  // Name of the task in the configuration file
  id: 'simple-task',

  // In which order we close the task ? Because we have only one task, it's 1
  closureHierarchy: 1,

  // The color to use when performing display
  color: colorToUse,

  // Say the task can be runned on both Slave and Master process
  idsAllowedRole: [_Library2.default.CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id, _Library2.default.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id],

  // The task object
  obj: _SimpleTask2.default.getInstance()
});

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
            _context.prev = 0;
            _context.next = 3;
            return roleAndTask.getSlaveNorMaster();

          case 3:
            role = _context.sent;


            if (role && role.id === _Library2.default.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
              console.log(' > ' + processPid + ' : New State detected : ' + state.name + '/#' + state.id);
            }
            _context.next = 9;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()
// The getSlaveNorMaster() method can fail if no role is started, we can ignore the error
);

/**
 * Startup the whole processus launch thing
 */
roleAndTask.boot();
//# sourceMappingURL=main.js.map
