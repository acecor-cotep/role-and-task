import v8 from 'v8';

import CONSTANT from './Utils/CONSTANT/CONSTANT';
import Utils from './Utils/Utils';
import Errors from './Utils/Errors';
import RoleHandler from './RoleSystem/Handlers/RoleHandler';
import PromiseCommandPattern from './Utils/PromiseCommandPattern';
import SystemBoot from './systemBoot/systemBoot';
import ARole, { DisplayMessage } from './RoleSystem/Role/ARole';
import ATask from './RoleSystem/Tasks/ATask';
import { Something } from './RoleSystem/Handlers/AHandler';
import Master from './RoleSystem/Role/RoleMaster/Master';
import ASlave from './RoleSystem/Role/RoleSlave/ASlave';

let instance: RoleAndTask | null = null;

interface State {
  name: string;
  id: number;
}

interface ProgramStateChange {
  resolve: Function;
  reject: Function;
  programState: State;
  inProgress: boolean;
}

export interface Task {
  id: string;
  name: string;
  color: string;
  closureHierarchy: number;
  idsAllowedRole: string[];
  obj: ATask;

  // Only works if the task is started in master
  notifyAboutArchitectureChange?: boolean;
}

interface Role {
  name: string;
  id: string | -1;
  'class': typeof ARole;
  obj?: ARole;
}

/**
 * Class which is the interface with the library user
 */
export default class RoleAndTask {
  //
  // Mandatory to fill
  //

  // Set the Master Slave Configuration File to load
  public launchMasterSlaveConfigurationFile: string | false = false;

  // Path to the entry point of your program, we use to pop a new slave
  public pathToEntryFile: string | false = false;

  // The task we use to perform the displays : The task must be in master! If no task is provided here, the display is made to stdout
  public displayTask: string | false = false;

  //
  // Options
  //

  // Are we displaying the logs ?
  public displayLog = true;

  // Do we makes the error to be fatal ? One error -> Exit
  public makesErrorFatal: boolean = CONSTANT.MAKES_ERROR_FATAL;

  // Do we consider warning as errors ?
  public considerWarningAsErrors: boolean = CONSTANT.CONSIDER_WARNING_AS_ERRORS;

  // The amount of time a master wait for a slave message before to timeout
  public masterMessageWaitingTimeout: number = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT;

  // The amount of time a master wait for a slave message to acknowledge the state change before to timeout
  public masterMessageWaitingTimeoutStateChange: number = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE;

  // The amount of time a master wait for a slave message before to timeout
  public masterMessageWaitingTimeoutStopTask: number = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK;

  public masterMessageWaitingTimeoutStopChange = 30000;

  //
  //

  // Contains all the tasks referenced
  public tasks: Task[] = [];

  // Contains all the roles referenced
  protected roles: Role[] = [];

  // Contains all the states the system can have
  protected states: State[] = [];

  // Array where we store the functions to call when the state change
  protected stateChangeCallbacks: {
    callback: Function;
    descriptor: string;
  }[] = [];

  // The state of program patform
  protected programState: State = CONSTANT.DEFAULT_STATES.LAUNCHING;

  // All the orders in a row to change the program state
  protected programStateChangeWaitingList: ProgramStateChange[] = [];

  // When poping a new process, we start it using a "launching mode", there are two basic launching mode for "slave" and "master"
  // You can set up a custom launching mode
  public customLaunchingMode: {
    name: string;
    func: Function;
  }[] = [];

  // Are we quitting?
  protected quitOrder = false;

  // Contains the functions to call to validate mutex take and release in master/slave protocol
  protected masterMutexValidationFunctions: {
    id: string;
    funcTake: Function;
    funcRelease: Function;
  }[] = [];

  protected systemBoot: SystemBoot | null = null;

  protected mode: any;

  protected modeoptions: any;

  // Initialize the role handler in here
  protected roleHandler: RoleHandler | null = null;

  protected startDate = new Date();

  /**
   * Constructor working the Singleton way
   */
  constructor() {
    if (instance) {
      return instance;
    }

    this.tasks = [
      ...Object.keys(CONSTANT.DEFAULT_TASK)
        .map(x => CONSTANT.DEFAULT_TASK[x]),
    ].filter(x => x.id !== -1);

    this.roles = [
      ...Object.keys(CONSTANT.DEFAULT_ROLES)
        .map(x => CONSTANT.DEFAULT_ROLES[x]),
    ].filter(x => x.id !== -1);

    this.states = [
      ...Object.keys(CONSTANT.DEFAULT_STATES)
        .map(x => CONSTANT.DEFAULT_STATES[x]),
    ];

    // Handle the signals such as SIGINT, SIGTERM...
    this.handleSignals();

    RoleAndTask.watchMemoryUsage();

    instance = this;

    return instance;
  }

  /**
   * Watch the memory usage of the current process.
   *
   * Show a warning at 60+% memory usage consumption
   * Throw an error at 90+% memory usage consumption
   *
   * Show a warning every 30 second at max
   */
  protected static watchMemoryUsage(): void {
    let lastWarning = Date.now();

    /* eslint-disable @typescript-eslint/camelcase */
    /* eslint-disable no-console */

    setInterval(() => {
      const {
        total_heap_size,
        heap_size_limit,
      } = v8.getHeapStatistics();

      const percentageUsed = total_heap_size * 100 / heap_size_limit;

      // Show a warning every 30 sec if a process is too high in memory usage
      if (percentageUsed > 60 && (Date.now() - lastWarning > 30000)) {
        lastWarning = Date.now();

        console.error(
          `Warning: The memory consumption is reaching ${percentageUsed}% - ELIOT will shut down at soon at it reaches 90+% to prevent memory allocation failure`,
        );

        console.error(`Memory used :: Using ${total_heap_size} / ${heap_size_limit}`);
      }

      if (percentageUsed > 90) {
        console.error(
          `Error: The memory consumption is reaching ${percentageUsed}% - ELIOT shut down to prevent memory allocation failure`,
        );

        console.error(`Memory used :: Using ${total_heap_size} / ${heap_size_limit}`);

        throw new Error('OUT_OF_MEMORY');
      }
    }, 3000);

    /* eslint-disable no-console */
    /* eslint-enable @typescript-eslint/camelcase */
  }

  /**
   * Get the good element to treat (Look at specific behavior described into lookAtProgramStateChangePipe comment)
   * (If there is actually something in progress, do nothing)
   */
  protected getProgramStateChangeToTreat(): ProgramStateChange | false {
    // No change to perform
    if (!this.programStateChangeWaitingList.length) {
      return false;
    }

    let inProgress = false;
    let errorElement: ProgramStateChange | false = false;

    this.programStateChangeWaitingList.some((x) => {
      // We do nothing if something is in progress exept if error
      if (x.inProgress) {
        inProgress = true;
      }

      if (x.programState.id === CONSTANT.DEFAULT_STATES.ERROR.id) {
        errorElement = x;

        return true;
      }

      return false;
    });

    // Error comes first
    if (errorElement) {
      return errorElement;
    }

    if (inProgress) {
      return false;
    }

    // Then regular
    return this.programStateChangeWaitingList[0];
  }

  /**
   * Some program element got treated, remove them from the pipe
   */
  protected programChangeElementGotTreated(elem: false | ProgramStateChange): void {
    this.programStateChangeWaitingList = this.programStateChangeWaitingList.filter(x => x !== elem);

    // look if there is something else to do
    this.lookAtProgramStateChangePipe();
  }

  /**
   * Send the message saying the state change to whom is interested to know
   */
  public spreadStateToListener(): void {
    this.stateChangeCallbacks.forEach(({
      callback,
    }) => {
      setImmediate(() => callback(this.states.find(x => x.id === this.programState.id)), 0);
    });
  }

  /**
   * Look at the programStateChangeWaitingList array, and perform an program state change if we need to
   * Specific behavior:
   *
   * (1) Error change state always pass first
   * (2) When you want to change the state as something already true, resolve() directly
   */
  protected lookAtProgramStateChangePipe(): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const elementToTreat = this.getProgramStateChangeToTreat();

        // Nothing to do
        if (!elementToTreat) {
          return false;
        }

        elementToTreat.inProgress = true;

        // If the state is already the good one
        if (elementToTreat.programState.id === this.programState.id) {
          // Resolve the program change as a success
          elementToTreat.resolve();

          return this.programChangeElementGotTreated(elementToTreat);
        }

        const oldProgramState = this.programState;

        this.programState = elementToTreat.programState;

        try {
          const role = await this.getSlaveNorMaster();

          // If we are the master - handle it
          if (role && (role as unknown as Role).id === CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
            const ret = await (role as Master).handleProgramStateChange(elementToTreat.programState, oldProgramState);

            // Say to everyone which is listening that the state changed
            this.spreadStateToListener();

            elementToTreat.resolve(ret);

            return this.programChangeElementGotTreated(elementToTreat);
          }

          // Say to everyone which is listening that the state changed
          this.spreadStateToListener();

          // If we are the slave - Do nothing else here (we just set the this.programState)
          elementToTreat.resolve();

          return this.programChangeElementGotTreated(elementToTreat);
        } catch (err) {
          elementToTreat.reject(err);

          return this.programChangeElementGotTreated(elementToTreat);
        }
      },
    });
  }

  /**
   * Singleton getter
   */
  public static getInstance(): RoleAndTask {
    return instance || new RoleAndTask();
  }

  /**
   * Launch the system
   *
   * We have to load dynamically systemBoot to avoid recursive import
   */
  public async boot(): Promise<void> {
    const SystemBoot = require('./systemBoot/systemBoot.js')
      .default;

    this.systemBoot = new SystemBoot({
      mode: this.mode,
      modeoptions: this.modeoptions,
    }).initialization();

    if (this.systemBoot === null) {
      throw new Errors('EXXXX', 'systemboot null');
    }

    // Get the instances of the roles class before to push it into the roleHandler
    this.roles = this.roles.map(x => ({
      ...x,

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      obj: x.class.getInstance(),
    }));

    // Initialize the role handler in here
    // We know here that we have the correct type
    this.roleHandler = new RoleHandler(this.roles as unknown as Something<ARole>);

    await this.systemBoot
      .launch(this.launchMasterSlaveConfigurationFile);

    this.startDate = new Date();
  }

  /**
   * Launch the system ** can be called static **
   */
  public static async boot(): Promise<void> {
    return RoleAndTask.getInstance()
      .boot();
  }

  /**
   * Subscribe to the state change. Returns the descriptor to use to unsubscribe
   */
  public subscribeToStateChange(callback: Function): string {
    const descriptor = Utils.generateLittleID();

    this.stateChangeCallbacks.push({
      callback,
      descriptor,
    });

    return descriptor;
  }

  /**
   * Unsubscribe to state change, passing the descriptor returned by subscribe function
   */
  public unSubscribeToStateChange(descriptor: string): void {
    this.stateChangeCallbacks = this.stateChangeCallbacks.filter(x => x.descriptor !== descriptor);
  }

  /**
   * Declare a new launching mode for processes
   *
   * Basics launching mode are 'slave' and 'master'.
   *
   * > If you want a custom Role maybe you would implement your curstom launching mode
   */
  public declareLaunchingMode(name: string, func: Function): void {
    this.customLaunchingMode.push({
      name,
      func,
    });
  }

  /**
   * Remove a custom launching mode
   */
  public unDeclareLaunchingMode(name: string): void {
    this.customLaunchingMode = this.customLaunchingMode.filter(x => x.name !== name);
  }

  /**
   * Declare a new state
   */
  public declareState(stateConfiguration: State): void {
    this.states.push(stateConfiguration);
  }

  /**
   * Declare a new Role
   *
   * {
   *   name: String,
   *   id: String,
   *   class: ARole,
   * }
   */
  declareRole(roleConfiguration: {
    name: string;
    id: string;
    'class': typeof ARole;
  }): void {
    this.roles.push(roleConfiguration);
  }

  /**
   * Declare the given task to the task system
   */
  public declareTask(taskConfiguration: Task): void {
    this.tasks.push(taskConfiguration);
  }

  /**
   * Remove the task from the task list using the task id
   */
  public removeTask(taskName: string): void {
    this.tasks = this.tasks.filter(x => x.id !== taskName);
  }

  /**
   * Get the tasks related to the given role id
   */
  public getRoleTasks(idRole: string): Task[] {
    return this.tasks.filter(x => x.idsAllowedRole.includes(idRole));
  }

  /**
   * Get the roles configuration
   */
  public getRoles(): (Role | false)[] {
    return this.roles.map((x) => {
      if (x.id === -1) {
        return false;
      }

      return {
        ...x,

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        obj: x.class.getInstance(),
      };
    }).filter(x => x);
  }

  /**
   * Get the actual running role
   */
  public getActualRole(possibilities: string[], i: number): Promise<false | ARole> {
    return PromiseCommandPattern({
      func: async () => {
        // If there is no more possibilities - Error
        if (i >= possibilities.length) {
          throw new Errors('EXXXX', 'No role available');
        }

        const roleHandler = this.getRoleHandler();

        if (roleHandler === null) {
          throw new Errors('EXXXX', 'role handler null');
        }

        // Try one
        const role = await roleHandler.getRole(possibilities[i]);

        // If its not active, do nothing
        if (!role.isActive()) {
          // Try next
          return false;
        }

        // Its good we can stop now
        return role;
      },
    });
  }

  /**
   * Get the slave role nor the master
   * Take the first that is active
   */
  public getSlaveNorMaster(): Promise<false | ARole> {
    return PromiseCommandPattern({
      func: () => Utils.promiseCallUntilTrue({
        functionToCall: this.getActualRole,
        context: this,

        args: [
          this.roles.map(x => x.id),
        ],
      }),
    });
  }

  /**
   * Change the program state
   * Role master: Set this.programState & spread the news to itselfs tasks and slaves
   * Role slate: Set the this.programState
   */
  public changeProgramState(idProgramState: number): Promise<void> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // Push the order in the list of state change to perform
        this.programStateChangeWaitingList.push({
          resolve,
          reject,

          // We will always fing a state
          programState: this.states.find(x => x.id === idProgramState) as State,

          inProgress: false,
        });

        this.lookAtProgramStateChangePipe();
      }),
    });
  }

  /**
   * Get the name of the task who asked for the display
   */
  public static getTheTaskWhoPerformTheDisplay(role: ARole): string {
    const roleHandler = role.getTaskHandler();

    if (roleHandler === false) {
      throw new Errors('EXXXX', 'role handler false');
    }

    const activeTasks = roleHandler.getAllActiveTasks();

    if (!activeTasks.length) {
      return `${process.pid}`;
    }

    return activeTasks[0].name;
  }

  /**
   * Handle the display message throught the slaves and master
   * If we are master we display the message
   * If we are a slave we give the messsage to the master
   */
  public displayMessage(param: DisplayMessage): Promise<false> {
    return PromiseCommandPattern({
      func: async () => {
        try {
          const role = await this.getSlaveNorMaster();

          if (!role) {
            return false;
          }

          // Handle the fact we are trying to display an object
          const isString = Utils.isAString(param.str);

          if (isString) {
            return role.displayMessage({
              ...param,

              // Add the task who perform the display
              from: RoleAndTask.getTheTaskWhoPerformTheDisplay(role),

              time: Date.now(),
            });
          }

          const newParam = {
            ...param,

            // Add the task who perform the display
            from: RoleAndTask.getTheTaskWhoPerformTheDisplay(role),

            time: Date.now(),
          };

          newParam.str = JSON.stringify(newParam.str, null, 2);

          // Add here the task who performed the display and the time of it

          return role.displayMessage(newParam);
        } catch (e) {
          // Here means that we have no role available, and so that we try to display message
          // when the role is not even launched
          // We simply ignore the message
          // MESSAGE TO THE DEVELOPPER, DISPLAY NOTHING BEFORE ROLES GET STARTED
          return false;
        }
      },
    });
  }

  /**
   * Here we come when an error happened on the system and we want to deal with it,
   * If we are the master, we tell ourselves about it
   * If we are a slave or ... we tell the master about it
   */
  public errorHappened(err: Error | Errors): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        // Error happens
        Utils.displayMessage({
          str: String((err instanceof Error ? (err && err.stack) : err) || err),

          out: process.stderr,
        });

        try {
          const role = await this.getSlaveNorMaster();

          if (!role) {
            return;
          }

          if (role.id !== CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
            // Send a message to the master
            return (role as ASlave).tellMasterErrorHappened(err);
          }

          try {
            // If we are the master ourselves, we put program in error
            await this.changeProgramState(CONSTANT.DEFAULT_STATES.ERROR.id);

            // We did sent the message :)
            // Display the error message
            this.displayMessage({
              str: String((err instanceof Error ? (err && err.stack) : err) || err),

              tags: [
                CONSTANT.MESSAGE_DISPLAY_TAGS.ERROR,
              ],
            });

            // If the errors are supposed to be fatal, exit!
            if (RoleAndTask.getInstance().makesErrorFatal) {
              await this.makeTheMasterToQuitTheWholeApp();

              RoleAndTask.exitProgramUnproperDueToError();
            }
          } catch (e) {
            // We exit PROGRAM, nothing more we can do
            // We locally display the error so it will finish into the node-error.log file
            RoleAndTask.exitProgramMsg('Exit program unproper ERROR HAPPENED', err, e);

            // We use setTimeout tho if there is some others things to do before the quit it will
            RoleAndTask.exitProgramUnproperDueToError();
          }
        } catch (e) {
          RoleAndTask.exitProgramMsg('Exit program unproper ERROR HAPPENED CATCH', err, e);

          // We use setTimeout tho if there is some others things to do before the quit it will
          RoleAndTask.exitProgramUnproperDueToError();
        }
      },
    });
  }

  /**
   * Display messages about exiting program in errorHappened
   */
  public static exitProgramMsg(txt: string, err: Error | Errors, e: Error | Errors): void {
    // We exit PROGRAM, nothing more we can do
    Utils.displayMessage({
      str: String((err instanceof Error ? (err && err.stack) : err) || err),
      out: process.stderr,
    });

    // We locally display the error so it will finish into the node-error.log file
    Utils.displayMessage({
      str: String(e),
      out: process.stderr,
    });

    Utils.displayMessage({
      str: 'Exit program unproper ERROR HAPPENED CATCH',
      out: process.stderr,
    });
  }

  /**
   * Make the master to quit every slaves and every task
   * DO NOT QUIT THE APP
   */
  public makeTheMasterToQuitEverySlaveAndTask(): Promise<boolean> {
    return PromiseCommandPattern({
      func: async () => {
        // Do nothing when we already got an order for closure
        if (this.quitOrder) {
          return false;
        }

        this.quitOrder = true;

        const role = await this.getSlaveNorMaster();

        // If we are the master - handle it
        if (role === false || role.id !== CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
          throw new Errors('EXXXX', 'Closure not possible in a slave');
        }

        /**
         * We change the program state to CLOSE
         */
        await this.changeProgramState(CONSTANT.DEFAULT_STATES.CLOSE.id);

        return this.quit();
      },
    });
  }

  /**
   * Properly quit the app if we are on master
   * Ignore if we are inside something else
   */
  public makeTheMasterToQuitTheWholeApp(): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        // If the state is LAUNCHING do not quit the app
        if (this.programState.id === CONSTANT.DEFAULT_STATES.LAUNCHING.id) {
          this.displayMessage({
            str: 'Cannot close PROGRAM when the state is LAUNCHING',
          });

          return;
        }

        try {
          const quit = await this.makeTheMasterToQuitEverySlaveAndTask();

          if (quit) {
            RoleAndTask.exitProgramGood();
          }

          // Do nothing if quit equal to false
          // ...
        } catch (err) {
          RoleAndTask.getInstance()
            .errorHappened(err);
        }
      },
    });
  }

  /**
   * We exit PROGRAM unproperly due to an error that can't be fixed regulary
   * (Ex: lose the communication between the slave and the master and we are the slave)
   */
  public static exitProgramUnproperDueToError(): void {
    // Exit after a timeout to let the system makes the displays
    setTimeout(() => process.exit(1), CONSTANT.TIMEOUT_LEAVE_PROGRAM_UNPROPER);
  }

  /**
   * We exit PROGRAM when everything had been closed the right way
   */
  public static exitProgramGood(): void {
    Utils.displayMessage({
      str: 'Exit program good',
      out: process.stderr,
    });

    process.exit(0);
  }

  public handleSignals(): void {
    // Exit PROGRAM properly
    const signalActionProper = async (): Promise<void> => {
      const role = await this.getSlaveNorMaster();

      if (!role) {
        return;
      }

      // If we are the master - handle it - if we are a slave ignore it
      if (role.id !== CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
        return;
      }

      this.makeTheMasterToQuitTheWholeApp();
    };

    // Exit PROGRAM unproperly
    const signalActionUnproper = () => {
      RoleAndTask.exitProgramUnproperDueToError();
    };

    Object.keys(CONSTANT.SIGNAL)
      .forEach((x) => {
        process.on(CONSTANT.SIGNAL[x], () => signalActionProper());
      });

    Object.keys(CONSTANT.SIGNAL_UNPROPER)
      .forEach((x) => {
        process.on(CONSTANT.SIGNAL_UNPROPER[x], () => signalActionUnproper());
      });
  }

  /**
   * Spread data to every tasks we locally hold
   */
  public spreadDataToEveryLocalTask({
    dataName,
    data,
    timestamp,
    limitToTaskList,
  }: {
    dataName: string;
    data: any;
    timestamp: number;
    limitToTaskList: string[];
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        try {
          const role = await this.getSlaveNorMaster();

          if (!role) {
            return;
          }

          const taskHandler = role.getTaskHandler();

          if (!taskHandler) {
            return;
          }

          taskHandler.getAllActiveTasks()
            .forEach((x) => {
              // Do not tell the tasks that do not require to know
              if (!limitToTaskList || limitToTaskList.some(y => x.id === y)) {
                // Make it asynchronous!
                setTimeout(() => {
                  x.consumeNewsData(dataName, data, timestamp);
                }, 0);
              }
            });
        } catch (err) {
          this.errorHappened(err);
        }
      },
    });
  }

  /**
   * THIS METHOD WORK ONLY IN THE MASTER
   * (It get called by HandleProgramTask)
   *
   * It returns in an array the whole system pids (Master + Slaves processes)
   */
  public getFullSystemPids(): Promise<string[]> {
    return PromiseCommandPattern({
      func: async () => {
        const role = await this.getMasterRole();

        return (role as Master).getFullSystemPids();
      },
    });
  }

  /**
   * Get the master role (error if we are not in master role process)
   */
  public getMasterRole(): Promise<ARole> {
    return PromiseCommandPattern({
      func: async () => {
        const roleHandler = this.getRoleHandler();

        if (roleHandler === null) {
          throw new Errors('EXXXX', 'role handler null');
        }

        const roleMaster = await roleHandler.getRole(CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id);

        // If its not active, do nothing
        if (!roleMaster.isActive()) {
          throw new Errors('EXXXX', 'Master is not active in getMasterRole');
        }

        // Its good
        return roleMaster;
      },
    });
  }

  public getRoleHandler(): RoleHandler | null {
    return this.roleHandler;
  }

  /**
   * Quit everything that is open
   *
   * Including:
   *
   * -> Close the role (Slave or Master)
   * ----> If slave: Close its running tasks
   * ----> If master: Close all the slaves
   */
  public quit(): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const role = await this.getSlaveNorMaster();

        if (!role) {
          return false;
        }

        await role.stop();

        return true;
      },
    });
  }

  /**
   * Declare a new Role
   */
  public static declareRole(roleConfiguration: {
    name: string;
    id: string;
    'class': typeof ARole;
  }): void {
    this.getInstance()
      .declareRole(roleConfiguration);
  }

  /**
   * Declare a new State in addition of the defaults ones
   */
  public static declareState(stateConfiguration: {
    name: string;
    id: number;
  }): void {
    this.getInstance()
      .declareState(stateConfiguration);
  }

  /**
   * Declare the given task to the task system
   */
  public static declareTask(taskConfiguration: Task): void {
    this.getInstance()
      .declareTask(taskConfiguration);
  }

  /**
   * Remove the task from the task list using the task id
   */
  public static removeTask(taskName: string): void {
    this.getInstance()
      .removeTask(taskName);
  }

  /**
   * Set the configuration through one function
   *
   * Returns the list of the configuration that has been accepted and setted
   */
  public setConfiguration(opts: any) {
    const availableOpts = [
      'mode',
      'modeoptions',
      'displayTask',
      'launchMasterSlaveConfigurationFile',
      'pathToEntryFile',
      'displayLog',
      'makesErrorFatal',
      'considerWarningAsErrors',
      'masterMessageWaitingTimeout',
      'masterMessageWaitingTimeoutStateChange',
      'masterMessageWaitingTimeoutStopTask',
    ];

    const mandatoryOpts = [
      'mode',
      'modeoptions',
      'launchMasterSlaveConfigurationFile',
      'pathToEntryFile',
    ].reduce((tmp, x) => {
      tmp[x] = null;
      return tmp;
    }, {});

    const setted = Object.keys(opts)
      .reduce((tmp, x) => {
        // Unknown key
        if (!availableOpts.includes(x)) {
          return tmp;
        }

        // Set the option value
        this[x] = opts[x];

        tmp[x] = opts[x];

        if (mandatoryOpts[x] !== void 0) {
          mandatoryOpts[x] = true;
        }

        return tmp;
      }, {});

    if (Object.values(mandatoryOpts)
      .includes(null)) {
      throw new Error(`Mandatory option ${Object.keys(mandatoryOpts).find(x => mandatoryOpts[x] === null)} is missing`);
    }

    // Display the options that has been setted up
    this.displayMessage({
      str: 'role-and-task : Following options has been setted up : ',
    });

    this.displayMessage({
      str: JSON.stringify(setted, null, 5),
    });

    return setted;
  }

  /**
   * In master/slave protocol, we ask to get a token
   *
   * SHORTCUT
   */
  public takeMutex(id: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const role = await this.getSlaveNorMaster();

        if (!role) {
          return;
        }

        return role.takeMutex(id);
      },
    });
  }

  /**
   * In master/slave protocol, we ask to release the token
   *
   * SHORTCUT
   */
  public async releaseMutex(id: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const role = await this.getSlaveNorMaster();

        if (!role) {
          return;
        }

        return role.releaseMutex(id);
      },
    });
  }

  /**
   * Contains the functions to call to validate mutex take and release in master/slave protocol
   */
  public getMasterMutexFunctions(): {
    id: string;
    funcTake: Function;
    funcRelease: Function;
  }[] {
    return this.masterMutexValidationFunctions;
  }

  /**
   * Add a function to be called when a user want to take the Mutex related to the given id
   *
   * The function have to throw an error if the token cannot be taken, if it goes well, consider the mutex to be taken
   */
  public addMasterMutexFunctions(id: string, funcTake: Function, funcRelease: Function): void {
    this.masterMutexValidationFunctions.push({
      id,
      funcTake,
      funcRelease,
    });
  }
}
