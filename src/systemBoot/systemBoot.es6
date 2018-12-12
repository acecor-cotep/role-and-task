//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import EventEmitter from 'events';
import commandLineArgs from 'command-line-args';

import LaunchScenarios from './LaunchScenarios.js';
import RoleAndTask from '../RoleAndTask.js';
import Utils from '../Utils/Utils.js';
import Errors from '../Utils/Errors.js';
import CONSTANT from '../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../Utils/PromiseCommandPattern.js';

// We are in the main here
export default class SystemBoot {
  /**
   * Constructor
   */
  constructor() {
    // Do we launch master or slave or oldway?
    // Get the options
    this.options = commandLineArgs([{
      // Theses must be like --mode optA=12 optB=9
      name: CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
      alias: CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
      type: String,
    }, {
      // Theses must be like --mode-options optA=12 optB=9
      name: CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
      alias: CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
      type: String,
      multiple: true,
    }]);

    this.launchingModesMap = LaunchScenarios.getInstance()
      .getMapLaunchingModes();
  }

  /**
   * System initialization (not PROGRAM)
   */
  static systemInitialization() {
    // We catch uncaught exceptions
    process.on(CONSTANT.PROCESS_EXCEPTION, (err) => {
      //
      // SPECIFIC TO BLESSED PLUGIN
      //
      //
      // Ignore blessed errors because there is a non blocking issue unresolved in the plugin
      //
      //
      if (err && err.stack && err.stack.match(/^.+blessed.+$/im)) return;

      RoleAndTask.getInstance()
        .errorHappened(err);
    });

    // We catch unhandled promises
    process.on(CONSTANT.UNHANDLED_PROMISE_REJECTION, (reason) => {
      RoleAndTask.getInstance()
        .errorHappened(new Errors('GENERAL_CATCH', `${String(reason)}`));
    });

    // We catch warnings
    process.on(CONSTANT.NODE_WARNING, (reason) => {
      Utils.displayMessage({
        str: reason,
        out: process.stderr,
      });
    });

    // Set the maximum number of listeners Default is 11
    EventEmitter.defaultMaxListeners = CONSTANT.MAX_NUMBER_OF_LISTENER;
  }

  /**
   * PROGRAM System initialization
   */
  static programInitialization() {
    // LaunchScenarios the RoleAndTask initialization
    RoleAndTask.getInstance();
  }

  /**
   * All initializations
   */
  initialization() {
    SystemBoot.systemInitialization();

    SystemBoot.programInitialization();

    return this;
  }

  /**
   * LaunchScenarios PROGRAM
   */
  launch(launchMasterSlaveConfigurationFile) {
    return new PromiseCommandPattern({
      func: async () => {
        // Default launch mode
        if (!this.options.mode) this.options.mode = CONSTANT.DEFAULT_LAUNCHING_MODE;

        // Look if we have a mode that correspond to it
        const elem = this.launchingModesMap.find(x => x.name === this.options.mode);

        if (!elem) {
          Utils.displayMessage({
            str: new Errors('INVALID_LAUNCHING_MODE', 'Invalid launching mode'),

            tags: [
              CONSTANT.MESSAGE_DISPLAY_TAGS.ERROR,
            ],
          });

          return true;
        }

        try {
          // LaunchScenarios the thing
          await elem.func.call(LaunchScenarios.getInstance(), this.options, launchMasterSlaveConfigurationFile);
        } catch (err) {
          RoleAndTask.getInstance()
            .errorHappened(err);
        }

        return true;
      },
    });
  }
}
