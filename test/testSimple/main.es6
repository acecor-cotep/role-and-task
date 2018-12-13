//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import path from 'path';

import library from '../../src/Library.js';

const roleAndTask = new library.RoleAndTask();

// Set the configuration of the library
roleAndTask.setConfiguration({
  // Mandatory
  // Where the file describing the architecture to create is
  launchMasterSlaveConfigurationFile: `${path.resolve(__dirname)}/../../../test/testSimple/minimalArchitecture.hjson`,

  // Where is the file we use to launch the processes (the actual file)
  pathToEntryFile: `${path.resolve(__dirname)}/main.js`,
});

/**
 * Subscribe to the state change and display it
 */
roleAndTask.subscribeToStateChange(async (state) => {
  // If we are in the master we display the state
  const role = await roleAndTask.getSlaveNorMaster();

  if (role && role.id === library.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
    console.log(`New State : ${state.name}/#${state.id}`);
  }
});

/**
 * Startup the whole processus launch thing
 */
roleAndTask.boot();
