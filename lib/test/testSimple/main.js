"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _colors = _interopRequireDefault(require("colors"));

var _commandLineArgs = _interopRequireDefault(require("command-line-args"));

var _Utils = _interopRequireDefault(require("../../src/Utils/Utils.js"));

var _Library = _interopRequireDefault(require("../../src/Library.js"));

var _SimpleTask = _interopRequireDefault(require("./SimpleTask.js"));

//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//
// Imports
var roleAndTask = new _Library["default"].RoleAndTask();
/**
 * Takes option-key = ['optA=12', 'optB=78', ...]
 * and return [
 *   optA: '12',
 *   optB: '78',
 * ]
 *
 * @param {Object} options
 * @param {String} name
 */

function parseEqualsArrayOptions(options, name) {
  // If there is none informations
  if (!options || !options[name]) return {};

  if (!(options[name] instanceof Array)) {
    throw new Error("INVALID_LAUNCHING_PARAMETER : ".concat(name));
  }

  var tmp;
  var parsedOptions = {};
  var ret = options[name].some(function (x) {
    tmp = x.split('='); // If the pattern optA=value isn't respected return an error

    if (tmp.length !== 2) {
      return true;
    }

    parsedOptions[tmp[0]] = tmp[1];
    return false;
  });

  if (ret) {
    throw new Error("INVALID_LAUNCHING_PARAMETER : ".concat(name));
  }

  return parsedOptions;
} // Attach a color to the pid so you can easily identify it and see that there are 3 processes


var colorsArray = ['yellow', 'red', 'blue', 'cyan', 'red', 'magenta', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'rainbow', 'america', 'trap'];

var colorToUse = colorsArray[_Utils["default"].generateRandom(0, colorsArray.length - 1)];

var processPid = _colors["default"][colorToUse](String(process.pid)); // Store the string in global so it can be used in the Task runned in the process


global.processPid = processPid;
console.log("\n > ################################################\n >        Run TestSimple : Process ".concat(processPid, "\n >        Use : Ctrl + C to leave\n > ################################################\n\n")); // Declare the Task

roleAndTask.declareTask({
  name: 'SimpleTask',
  // Name of the task in the configuration file
  id: 'simple-task',
  // In which order we close the task ? Because we have only one task, it's 1
  closureHierarchy: 1,
  // The color to use when performing display
  color: colorToUse,
  // Say the task can be runned on both Slave and Master process
  idsAllowedRole: [_Library["default"].CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id, _Library["default"].CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id],
  // The task object
  obj: _SimpleTask["default"].getInstance()
}); // Do we launch master or slave or oldway?
// Get the options

var options = (0, _commandLineArgs["default"])([{
  // Theses must be like --mode optA=12 optB=9
  name: _Library["default"].CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
  alias: _Library["default"].CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
  type: String
}, {
  // Theses must be like --mode-options optA=12 optB=9
  name: _Library["default"].CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
  alias: _Library["default"].CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
  type: String,
  multiple: true
}]); // We have something like mode-options = ['optA=12', 'optB=78', ...]

var modeoptions = parseEqualsArrayOptions(options, _Library["default"].CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name);
var mode = options.mode; // Set the configuration of the library

roleAndTask.setConfiguration({
  // Mandatory
  // Mode lauching (master of slave)
  mode: mode,
  // Options object (identifier or other things)
  modeoptions: modeoptions,
  // Where the file describing the architecture to create is
  launchMasterSlaveConfigurationFile: "".concat(_path["default"].resolve(__dirname), "/../../../test/testSimple/minimalArchitecture.hjson"),
  // Where is the file we use to launch the processes (the actual file)
  pathToEntryFile: "".concat(_path["default"].resolve(__dirname), "/main.js")
});
/**
 * Subscribe to the state change and display it
 */

roleAndTask.subscribeToStateChange(
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(state) {
    var role;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return roleAndTask.getSlaveNorMaster();

          case 3:
            role = _context.sent;

            if (role && role.id === _Library["default"].CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
              console.log(" > ".concat(processPid, " : New State detected : ").concat(state.name, "/#").concat(state.id));
            }

            _context.next = 9;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
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
