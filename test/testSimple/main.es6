//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import path from 'path';
import colors from 'colors';

import Utils from '../../src/Utils/Utils.js';
import library from '../../src/Library.js';
import SimpleTask from './SimpleTask.js';

const roleAndTask = new library.RoleAndTask();

// Attach a color to the pid so you can easily identify it and see that there are 3 processes
const colorsArray = [
  'yellow',
  'red',
  'blue',
  'cyan',
  'red',
  'magenta',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyann',
  'rainbow',
  'america',
  'trap',
];

const colorToUse = colorsArray[Utils.generateRandom(0, colorsArray.length - 1)];

const processPid = colors[colorToUse](String(process.pid));

// Store the string in global so it can be used in the Task runned in the process
global.processPid = processPid;

console.log(
  `
 > ################################################
 >        Run TestSimple : Process ${processPid}
 >        Use : Ctrl + C to leave
 > ################################################

`,
);

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
  idsAllowedRole: [
    library.CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id,
    library.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id,
  ],

  // The task object
  obj: SimpleTask.getInstance(),
});

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
  try {
    // If we are in the master we display the state
    const role = await roleAndTask.getSlaveNorMaster();

    if (role && role.id === library.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
      console.log(` > ${processPid} : New State detected : ${state.name}/#${state.id}`);
    }
  } catch (e) {
    // The getSlaveNorMaster() method can fail if no role is started, we can ignore the error
  }
});

/**
 * Startup the whole processus launch thing
 */
roleAndTask.boot();
