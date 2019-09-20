//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import path from 'path';
import colors from 'colors';
import commandLineArgs from 'command-line-args';

import Utils from '../../src/Utils/Utils';
import library from '../../src/Library';
import SimpleTask from './SimpleTask';

const roleAndTask = new library.RoleAndTask();

/**
 * Takes option-key = ['optA=12', 'optB=78', ...]
 * and return [
 *   optA: '12',
 *   optB: '78',
 * ]
 */
function parseEqualsArrayOptions(options: any, name: string) {
  // If there is none informations
  if (!options || !options[name]) return {};

  if (!(options[name] instanceof Array)) {
    throw new Error(`INVALID_LAUNCHING_PARAMETER : ${name}`);
  }

  let tmp: any[];

  const parsedOptions = {};
  const ret = options[name].some((x: string) => {
    tmp = x.split('=');

    // If the pattern optA=value isn't respected return an error
    if (tmp.length !== 2) {
      return true;
    }

    parsedOptions[tmp[0]] = tmp[1];

    return false;
  });

  if (ret) {
    throw new Error(`INVALID_LAUNCHING_PARAMETER : ${name}`);
  }

  return parsedOptions;
}

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
  'bgCyan',
  'rainbow',
  'america',
  'trap',
];

const colorToUse = colorsArray[Utils.generateRandom(0, colorsArray.length - 1)];

const processPid = colors[colorToUse](String(process.pid));

// Store the string in global so it can be used in the Task runned in the process
// @ts-ignore
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

// Do we launch master or slave or oldway?
// Get the options
const options = commandLineArgs([{
  // Theses must be like --mode optA=12 optB=9
  name: library.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
  alias: library.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
  type: String,
}, {
  // Theses must be like --mode-options optA=12 optB=9
  name: library.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
  alias: library.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
  type: String,
  multiple: true,
}]);

// We have something like mode-options = ['optA=12', 'optB=78', ...]
const modeoptions = parseEqualsArrayOptions(options, library.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name);
const {
  mode,
} = options;

// Set the configuration of the library
roleAndTask.setConfiguration({
  // Mandatory
  // Mode lauching (master of slave)
  mode,

  // Options object (identifier or other things)
  modeoptions,

  // Where the file describing the architecture to create is
  launchMasterSlaveConfigurationFile: `${path.resolve(__dirname)}/../../../test/testSimple/minimalArchitecture.hjson`,

  // Where is the file we use to launch the processes (the actual file)
  pathToEntryFile: `${path.resolve(__dirname)}/main.js`,
});

/**
 * Subscribe to the state change and display it
 */
roleAndTask.subscribeToStateChange(async (state: any) => {
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