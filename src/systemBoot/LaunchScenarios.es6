//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../Utils/CONSTANT/CONSTANT.js';
import Utils from '../Utils/Utils.js';
import applyConfigurationMasterSlaveLaunch from './applyConfigurationMasterSlaveLaunch.js';
import RoleAndTask from '../RoleAndTask.js';
import PromiseCommandPattern from '../Utils/PromiseCommandPattern.js';

/**
 * This class implement the different launch scenarios of PROGRAM
 */
export default class LaunchScenarios {
  /**
   * Get the map of launching modes
   */
  static getMapLaunchingModes() {
    return [{
        name: CONSTANT.PROGRAM_LAUNCHING_MODE.MASTER,
        func: LaunchScenarios.master,
      }, {
        name: CONSTANT.PROGRAM_LAUNCHING_MODE.SLAVE,
        func: LaunchScenarios.slave,
      },

      // Add the custom launching mode in the map so they are taken in count
      ...RoleAndTask.getInstance()
      .customLaunchingMode,
    ];
  }

  /**
   * Read the Master Slave launch configuration file
   */
  static readLaunchMasterSlaveConfigurationFile(filename) {
    return new PromiseCommandPattern({
      func: async () => Utils.parseHjsonContent(await Utils.readFile(filename)),
    });
  }

  /**
   * Start PROGRAM in master mode
   */
  static master(options, launchMasterSlaveConfigurationFile) {
    return new PromiseCommandPattern({
      func: async () => {
        // Say to people in which state we are at launch -> LAUNCHING
        await RoleAndTask.getInstance()
          .spreadStateToListener();

        // LaunchScenarios the display of the program state (launching)
        // Load the configuration file configuration
        const launchConfFileContent = await LaunchScenarios.readLaunchMasterSlaveConfigurationFile(launchMasterSlaveConfigurationFile);

        await applyConfigurationMasterSlaveLaunch(launchConfFileContent);

        // Here we can put the system as ready
        await RoleAndTask.getInstance()
          .changeProgramState(CONSTANT.DEFAULT_STATES.READY_PROCESS.id);

        return true;
      },
    });
  }

  /**
   * Start PROGRAM in slave mode
   */
  static slave(options) {
    return new PromiseCommandPattern({
      func: async () => {
        const roleHandler = RoleAndTask.getInstance()
          .getRoleHandler();

        await roleHandler.startRole(CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id, options.modeoptions);

        return true;
      },
    });
  }
}
