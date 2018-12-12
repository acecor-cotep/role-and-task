//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../Utils/CONSTANT/CONSTANT.js';
import Utils from '../Utils/Utils.js';
import Errors from '../Utils/Errors.js';
import applyConfigurationMasterSlaveLaunch from './applyConfigurationMasterSlaveLaunch.js';
import RoleAndTask from '../RoleAndTask.js';
import PromiseCommandPattern from '../Utils/PromiseCommandPattern.js';

let instance = null;

/**
 * This class implement the different launch scenarios of ELIOT
 */
export default class LaunchScenarios {
  constructor() {
    if (instance) return instance;

    this.lastLaunch = false;

    instance = this;

    return instance;
  }

  /**
   * SINGLETON implementation
   */
  static getInstance() {
    return instance || new LaunchScenarios();
  }

  /**
   * Get the map of launching modes
   */
  getMapLaunchingModes() {
    return [{
        name: CONSTANT.ELIOT_LAUNCHING_MODE.MASTER,
        func: this.master,
      }, {
        name: CONSTANT.ELIOT_LAUNCHING_MODE.SLAVE,
        func: this.slave,
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
   * Start ELIOT in master mode
   */
  master(options, launchMasterSlaveConfigurationFile) {
    return new PromiseCommandPattern({
      func: async () => {
        this.lastLaunch = {
          method: this.master,
          options,
        };

        // Say to people in which state we are at launch -> LAUNCHING
        await RoleAndTask.getInstance()
          .spreadStateToListener();

        // LaunchScenarios the display of the eliot state (launching)
        // Load the configuration file configuration
        const launchConfFileContent = await LaunchScenarios.readLaunchMasterSlaveConfigurationFile(launchMasterSlaveConfigurationFile);

        await applyConfigurationMasterSlaveLaunch(launchConfFileContent);

        // Here we can put the system as ready
        await RoleAndTask.getInstance()
          .changeEliotState(CONSTANT.DEFAULT_STATES.READY_PROCESS.id);

        return true;
      },
    });
  }

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
  static parseEqualsArrayOptions(options, name) {
    return new PromiseCommandPattern({
      func: async () => {
        // If there is none informations
        if (!options || !options[name]) return {};

        if (!(options[name] instanceof Array)) throw new Errors('INVALID_LAUNCHING_PARAMETER', `Parameter: ${name}`);

        let tmp;

        const parsedOptions = {};
        const ret = options[name].some((x) => {
          tmp = x.split('=');

          // If the pattern optA=value isn't respected return an error
          if (tmp.length !== 2) return true;

          parsedOptions[tmp[0]] = tmp[1];

          return false;
        });

        if (ret) throw new Errors('INVALID_LAUNCHING_PARAMETER', `Parameter: ${name}`);

        return parsedOptions;
      },
    });
  }

  /**
   * Start ELIOT in slave mode
   */
  slave(options) {
    return new PromiseCommandPattern({
      func: async () => {
        const roleHandler = RoleAndTask.getInstance()
          .getRoleHandler();

        const optCreatSlave = {};

        this.lastLaunch = {
          method: this.slave,
          options,
        };

        // We have something like mode-options = ['optA=12', 'optB=78', ...]
        const parsedOptions = await LaunchScenarios.parseEqualsArrayOptions(options, CONSTANT.ELIOT_LAUNCHING_PARAMETERS.MODE_OPTIONS.name);

        // Create dynamically the options to create a new slave depending on what the CLI gave to us
        // Add as enter parameter all parameters that can be taken as Slave start
        Object.keys(CONSTANT.SLAVE_START_ARGS)
          .map(x => CONSTANT.SLAVE_START_ARGS[x])
          .forEach((x) => {
            if (parsedOptions[x]) optCreatSlave[x] = parsedOptions[x];
          });

        await roleHandler.startRole(CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id, optCreatSlave);

        return true;
      },
    });
  }
}
