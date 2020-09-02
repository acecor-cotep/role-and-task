//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import EventEmitter from 'events';

import LaunchScenarios from './LaunchScenarios.js';
import RoleAndTask from '../RoleAndTask.js';
import Utils from '../Utils/Utils.js';
import Errors from '../Utils/Errors.js';
import CONSTANT from '../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../Utils/PromiseCommandPattern.js';

// We are in the main here
export default class SystemBoot {
  protected options: any;

  protected launchingModesMap: { name: string, func: Function }[];

  constructor({
    mode,
    modeoptions,
  }) {
    this.options = {
      mode,
      modeoptions,
    };

    this.launchingModesMap = LaunchScenarios.getMapLaunchingModes();
  }

  /**
   * System initialization (not PROGRAM)
   */
  protected static systemInitialization() {
    // We catch uncaught exceptions
    process.on(CONSTANT.PROCESS_EXCEPTION, (err: Error) => {
      //
      // SPECIFIC TO BLESSED PLUGIN
      //
      //
      // Ignore blessed errors because there is a non blocking issue unresolved in the plugin
      //
      //
      if (err && err.stack && err.stack.match(/^.+blessed.+$/im)) {
        return;
      }

      RoleAndTask.getInstance()
        .errorHappened(err);
    });

    // We catch unhandled promises
    process.on(CONSTANT.UNHANDLED_PROMISE_REJECTION, (reason: string) => {
      RoleAndTask.getInstance()
        .errorHappened(new Errors('GENERAL_CATCH', `${String(reason)}`));
    });

    // We catch warnings
    process.on(CONSTANT.NODE_WARNING, (reason: string) => {
      Utils.displayMessage({
        str: reason,
        out: process.stderr,
      });

      if (RoleAndTask.getInstance().considerWarningAsErrors) {
        RoleAndTask.getInstance()
          .errorHappened(new Errors('GENERAL_CATCH', String(reason)));
      }
    });

    // @ts-ignore
    // Set the maximum number of listeners Default is 11
    EventEmitter.defaultMaxListeners = CONSTANT.MAX_NUMBER_OF_LISTENER;
  }

  protected static programInitialization() {
    // LaunchScenarios the RoleAndTask initialization
    RoleAndTask.getInstance();
  }

  protected initialization() {
    SystemBoot.systemInitialization();

    SystemBoot.programInitialization();

    return this;
  }

  /**
   * LaunchScenarios PROGRAM
   */
  public launch(launchMasterSlaveConfigurationFile): Promise<any> {
    return PromiseCommandPattern({
      func: async () => {
        // Default launch mode
        if (!this.options.mode) {
          throw new Errors('INVALID_LAUNCHING_MODE', 'Missing launching mode');
        }

        // Look if we have a mode that correspond to it
        const elem = this.launchingModesMap.find((x: any) => x.name === this.options.mode);

        if (!elem) {
          Utils.displayMessage({
            str: (new Errors('INVALID_LAUNCHING_MODE', 'Invalid launching mode')).toString(),
          });

          return true;
        }

        try {
          // LaunchScenarios the thing
          await elem.func.call(LaunchScenarios, this.options, launchMasterSlaveConfigurationFile);
        } catch (err) {
          RoleAndTask.getInstance()
            .errorHappened(err);
        }

        return true;
      },
    });
  }
}
