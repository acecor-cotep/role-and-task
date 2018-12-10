//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import library from '../../src/Library.js';

const roleAndTask = new library.RoleAndTask();

/**
 * Set the configuration file to load
 */
roleAndTask.setLaunchConfigurationFile('/home/neut_g/ELIOT/role-and-task/test/testSimple/minimalArchitecture.hjson');

/**
 * Startup the whole processus launch thing
 */
roleAndTask.boot();
