'use strict';

var _Library = require('../../src/Library.js');

var _Library2 = _interopRequireDefault(_Library);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roleAndTask = new _Library2.default.RoleAndTask();

/**
 * Set the configuration file to load
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
roleAndTask.setLaunchConfigurationFile('/home/neut_g/ELIOT/role-and-task/test/testSimple/minimalArchitecture.hjson');

/**
 * Startup the whole processus launch thing
 */
roleAndTask.boot();
//# sourceMappingURL=main.js.map
