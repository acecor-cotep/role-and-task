import CONSTANT from './Utils/CONSTANT/CONSTANT.js';
import Utils from './Utils/Utils.js';
import Errors from './Utils/Errors.js';
import RoleHandler from './RoleSystem/Handlers/RoleHandler.js';
import PromiseCommandPattern from './Utils/PromiseCommandPattern.js';

let instance = null;

/**
 * Class which is the interface with the library user
 */
export default class RoleAndTask {
  /**
   * Constructor working the Singleton way
   */
  constructor() {
    if (instance) return instance;

    //
    // Mandatory to fill
    //

    // Set the Master Slave Configuration File to load
    this.launchMasterSlaveConfigurationFile = false;

    // Path to the entry point of your program, we use to pop a new slave
    this.pathToEntryFile = false;

    // The task we use to perform the displays : The task must be in master! If no task is provided here, the display is made to stdout
    this.displayTask = false;

    //
    // Options
    //

    // Are we displaying the logs ?
    this.displayLog = true;

    // Do we makes the error to be fatal ? One error -> Exit
    this.makesErrorFatal = CONSTANT.MAKES_ERROR_FATAL;

    // Do we consider warning as errors ?
    this.considerWarningAsErrors = CONSTANT.CONSIDER_WARNING_AS_ERRORS;

    // The amount of time a master wait for a slave message before to timeout
    this.masterMessageWaitingTimeout = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT;

    // The amount of time a master wait for a slave message to acknowledge the state change before to timeout
    this.masterMessageWaitingTimeoutStateChange = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE;

    // The amount of time a master wait for a slave message before to timeout
    this.masterMessageWaitingTimeoutStopTask = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK;

    //
    //

    // Contains all the tasks referenced
    this.tasks = [
      ...Object.keys(CONSTANT.DEFAULT_TASK)
      .map(x => CONSTANT.DEFAULT_TASK[x]),
    ].filter(x => x.id !== -1);

    // Contains all the roles referenced
    this.roles = [
      ...Object.keys(CONSTANT.DEFAULT_ROLES)
      .map(x => CONSTANT.DEFAULT_ROLES[x]),
    ].filter(x => x.id !== -1);

    // Contains all the states the system can have
    this.states = [
      ...Object.keys(CONSTANT.DEFAULT_STATES)
      .map(x => CONSTANT.DEFAULT_STATES[x]),
    ];

    // Array where we store the functions to call when the state change
    this.stateChangeCallbacks = [];

    // The state of program patform
    this.programState = CONSTANT.DEFAULT_STATES.LAUNCHING;

    // All the orders in a row to change the program state
    this.programStateChangeWaitingList = [];

    // When poping a new process, we start it using a "launching mode", there are two basic launching mode for "slave" and "master"
    // You can set up a custom launching mode
    this.customLaunchingMode = [];

    // Are we quitting?
    this.quitOrder = false;

    // Contains the functions to call to validate mutex take and release in master/slave protocol
    this.masterMutexValidationFunctions = [];

    // Handle the signals
    this.handleSignals();

    instance = this;

    return instance;
  }

  //
  // PRIVATE METHODS
  //

  /**
   * Get the good element to treat (Look at specific behavior described into lookAtProgramStateChangePipe comment)
   * (If there is actually something in progress, do nothing)
   */
  getProgramStateChangeToTreat() {
    // No change to perform
    if (!this.programStateChangeWaitingList.length) return false;

    let inProgress = false;
    let errorElement = false;

    this.programStateChangeWaitingList.some((x) => {
      // We do nothing if something is in progress exept if error
      if (x.inProgress) inProgress = true;

      if (x.programState.id === CONSTANT.DEFAULT_STATES.ERROR.id) {
        errorElement = x;

        return true;
      }

      return false;
    });

    // Error comes first
    if (errorElement) return errorElement;

    // Then in progress
    if (inProgress) return false;

    // Then regular
    return this.programStateChangeWaitingList[0];
  }

  /**
   * Some program element got treated, remove them from the pipe
   * @param {Object} elem
   */
  programChangeElementGotTreated(elem) {
    this.programStateChangeWaitingList = this.programStateChangeWaitingList.filter(x => x !== elem);

    // look if there is something else to do
    this.lookAtProgramStateChangePipe();
  }

  /**
   * Send the message saying the state change to whom is interested to know
   */
  spreadStateToListener() {
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
  lookAtProgramStateChangePipe() {
    return new PromiseCommandPattern({
      func: async () => {
        const elementToTreat = this.getProgramStateChangeToTreat();

        // Nothing to do
        if (!elementToTreat) return false;

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
          if (role.id === CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
            const ret = await role.handleProgramStateChange(elementToTreat.programState, oldProgramState);

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

  //
  // PUBLIC METHODS
  //

  /**
   * Singleton getter
   */
  static getInstance() {
    return instance || new RoleAndTask();
  }

  /**
   * Launch the system
   *
   * We have to load dynamically systemBoot to avoid recursive import
   */
  boot() {
    const SystemBoot = require('./systemBoot/systemBoot.js')
      .default;

    this.systemBoot = new SystemBoot({
      mode: this.mode,
      modeoptions: this.modeoptions,
    }).initialization();

    // Get the instances of the roles class before to push it into the roleHandler
    this.roles = this.roles.map(x => ({
      ...x,

      obj: x.class.getInstance(),
    }));

    // Initialize the role handler in here
    this.roleHandler = new RoleHandler(this.roles);

    this.systemBoot
      .launch(this.launchMasterSlaveConfigurationFile);

    this.startDate = new Date();
  }

  /**
   * Launch the system ** can be called static **
   */
  static boot() {
    RoleAndTask.getInstance()
      .boot();
  }

  /**
   * Subscribe to the state change. Returns the descriptor to use to unsubscribe
   */
  subscribeToStateChange(callback) {
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
  unSubscribeToStateChange(descriptor) {
    this.stateChangeCallbacks = this.stateChangeCallbacks.filter(x => x.descriptor !== descriptor);
  }

  /**
   * Declare a new launching mode for processes
   *
   * Basics launching mode are 'slave' and 'master'.
   *
   * > If you want a custom Role maybe you would implement your curstom launching mode
   */
  declareLaunchingMode(name, func) {
    this.customLaunchingMode.push({
      name,
      func,
    });
  }

  /**
   * Remove a custom launching mode
   */
  unDeclareLaunchingMode(name) {
    this.customLaunchingMode = this.customLaunchingMode.filter(x => x.name !== name);
  }

  /**
   * Declare a new state
   *
   * {
   *   name: String,
   *   id: String,
   * }
   */
  declareState(stateConfiguration) {
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
  declareRole(roleConfiguration) {
    this.roles.push(roleConfiguration);
  }

  /**
   * Declare the given task to the task system
   *
   * {
   *   id: Number,
   *   name: String,
   *   color: String,
   *   closureHierarchy: Number,
   *   idsAllowedRole: [String],
   *   obj: ATask,
   *
   *   // Only works if the task is started in master
   *   notifyAboutArchitectureChange: Boolean,
   * }
   */
  declareTask(taskConfiguration) {
    this.tasks.push(taskConfiguration);
  }

  /**
   * Remove the task from the task list using the task id
   */
  removeTask(taskName) {
    this.tasks = this.tasks.filter(x => x.id !== taskName);
  }

  /**
   * Get the tasks related to the given role id
   */
  getRoleTasks(idRole) {
    return this.tasks.filter(x => x.idsAllowedRole.includes(idRole));
  }

  /**
   * Get the roles configuration
   */
  getRoles() {
    return this.roles.map((x) => {
        if (x.id === -1) return false;

        return {
          ...x,

          obj: x.class.getInstance(),
        };
      })
      .filter(x => x);
  }

  /**
   * Get the actual running role
   */
  getActualRole(possibilities, i) {
    return new PromiseCommandPattern({
      func: async () => {
        // If there is no more possibilities - Error
        if (i >= possibilities.length) throw new Errors('EXXXX', 'No role available');

        // Try one
        const role = await this.roleHandler.getRole(possibilities[i]);

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
  getSlaveNorMaster() {
    return new PromiseCommandPattern({
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
  changeProgramState(idProgramState) {
    return new PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // Push the order in the list of state change to perform
        this.programStateChangeWaitingList.push({
          resolve,
          reject,
          programState: this.states.find(x => x.id === idProgramState),
          inProgress: false,
        });

        this.lookAtProgramStateChangePipe();
      }),
    });
  }

  /**
   * Get the name of the task who asked for the display
   */
  static getTheTaskWhoPerformTheDisplay(role) {
    const activeTasks = role.getTaskHandler()
      .getAllActiveTasks();

    if (!activeTasks.length) return `${process.pid}`;

    return activeTasks[0].name;
  }

  /**
   * Handle the display message throught the slaves and master
   * If we are master we display the message
   * If we are a slave we give the messsage to the master
   * @param {Object} param
   */
  displayMessage(param) {
    return new PromiseCommandPattern({
      func: async () => {
        try {
          const role = await this.getSlaveNorMaster();

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
  errorHappened(err) {
    return new PromiseCommandPattern({
      func: async () => {
        // Error happens
        Utils.displayMessage({
          str: String((err && err.stack) || err),

          out: process.stderr,
        });

        try {
          const role = await this.getSlaveNorMaster();

          if (role.id !== CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
            // Send a message to the master
            return role.tellMasterErrorHappened(err);
          }

          try {
            // If we are the master ourselves, we put program in error
            await this.changeProgramState(CONSTANT.DEFAULT_STATES.ERROR.id);

            // We did sent the message :)
            // Display the error message
            this.displayMessage({
              str: String((err && err.stack) || err),

              tags: [
                CONSTANT.MESSAGE_DISPLAY_TAGS.ERROR,
              ],
            });

            // If the errors are supposed to be fatal, exit!
            if (RoleAndTask.getInstance()
              .makesErrorFatal) {
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

        return false;
      },
    });
  }

  /**
   * Display messages about exiting program in errorHappened
   */
  static exitProgramMsg(txt, err, e) {
    // We exit PROGRAM, nothing more we can do
    Utils.displayMessage({
      str: String((err && err.stack) || err),
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
  makeTheMasterToQuitEverySlaveAndTask() {
    return new PromiseCommandPattern({
      func: async () => {
        // Do nothing when we already got an order for closure
        if (this.quitOrder) return false;

        this.quitOrder = true;

        const role = await this.getSlaveNorMaster();

        // If we are the master - handle it
        if (role.id !== CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) throw new Errors('EXXXX', 'Closure not possible in a slave');

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
  makeTheMasterToQuitTheWholeApp() {
    return new PromiseCommandPattern({
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

          if (quit) RoleAndTask.exitProgramGood();

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
  static exitProgramUnproperDueToError() {
    // Exit after a timeout to let the system makes the displays
    setTimeout(() => process.exit(1), CONSTANT.TIMEOUT_LEAVE_PROGRAM_UNPROPER);
  }

  /**
   * We exit PROGRAM when everything had been closed the right way
   */
  static exitProgramGood() {
    Utils.displayMessage({
      str: 'Exit program good',
      out: process.stderr,
    });

    process.exit(0);
  }

  /**
   * Handle signals
   */
  handleSignals() {
    // Exit PROGRAM properly
    const signalActionProper = async () => {
      const role = await this.getSlaveNorMaster();

      // If we are the master - handle it - if we are a slave ignore it
      if (role.id !== CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) return;

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
   * @param {{dataName: String, data: Object, timestamp: Date, limitToTaskList: [String] | false}} args
   */
  spreadDataToEveryLocalTask({
    dataName,
    data,
    timestamp,
    limitToTaskList,
  }) {
    return new PromiseCommandPattern({
      func: async () => {
        try {
          const role = await this.getSlaveNorMaster();

          role.getTaskHandler()
            .getAllActiveTasks()
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
  getFullSystemPids() {
    return new PromiseCommandPattern({
      func: async () => {
        const role = await this.getMasterRole();

        return role.getFullSystemPids();
      },
    });
  }

  /**
   * Get the master role (error if we are not in master role process)
   */
  getMasterRole() {
    return new PromiseCommandPattern({
      func: async () => {
        const roleMaster = await this.getRoleHandler()
          .getRole(CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id);

        // If its not active, do nothing
        if (!roleMaster.isActive()) throw new Errors('EXXXX', 'Master is not active in getMasterRole');

        // Its good
        return roleMaster;
      },
    });
  }

  // Getter
  getRoleHandler() {
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
  quit() {
    return new PromiseCommandPattern({
      func: async () => {
        const role = await this.getSlaveNorMaster();

        await role.stop();

        return true;
      },
    });
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
  static declareRole(roleConfiguration) {
    this.getInstance()
      .declareRole(roleConfiguration);
  }

  /**
   * Declare a new State in addition of the defaults ones
   *
   * {
   *   name: String,
   *   id: String,
   * }
   */
  static declareState(stateConfiguration) {
    this.getInstance()
      .declareState(stateConfiguration);
  }

  /**
   * Declare the given task to the task system
   *
   * {
   *   id: Number,
   *   name: String,
   *   color: String,
   *   closureHierarchy: Number,
   *   idsAllowedRole: [Number],
   *   obj: ATask,
   *
   *   // Only works if the task is started in master
   *   notifyAboutArchitectureChange: Boolean,
   * }
   */
  static declareTask(taskConfiguration) {
    this.getInstance()
      .declareTask(taskConfiguration);
  }

  /**
   * Remove the task from the task list using the task id
   */
  static removeTask(taskName) {
    this.getInstance()
      .removeTask(taskName);
  }

  /**
   * Set the configuration through one function
   *
   * Returns the list of the configuration that has been accepted and setted
   */
  setConfiguration(opts) {
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
        if (!availableOpts.includes(x)) return tmp;

        // Set the option value
        this[x] = opts[x];

        tmp[x] = opts[x];

        if (mandatoryOpts[x] !== void 0) {
          mandatoryOpts[x] = true;
        }

        return tmp;
      }, {});

    if (Object.values(mandatoryOpts).includes(null)) {
      throw new Error(`Mandatory option ${Object.keys(mandatoryOpts).find(x => mandatoryOpts[x] === null)} is missing`);
    }

    // Display the options that has been setted up
    this.displayMessage({
      str: 'role-and-task : Following options has been setted up : ',
    });

    this.displayMessage({
      str: setted,
    });

    return setted;
  }

  /**
   * In master/slave protocol, we ask to get a token
   *
   * SHORTCUT
   */
  takeMutex(id) {
    return new PromiseCommandPattern({
      func: async () => {
        const role = await this.getSlaveNorMaster();

        return role.takeMutex(id);
      },
    });
  }

  /**
   * In master/slave protocol, we ask to release the token
   *
   * SHORTCUT
   */
  async releaseMutex(id) {
    return new PromiseCommandPattern({
      func: async () => {
        const role = await this.getSlaveNorMaster();

        return role.releaseMutex(id);
      },
    });
  }

  /**
   * Contains the functions to call to validate mutex take and release in master/slave protocol
   */
  getMasterMutexFunctions() {
    return this.masterMutexValidationFunctions;
  }

  /**
   * Add a function to be called when a user want to take the Mutex related to the given id
   *
   * The function have to throw an error if the token cannot be taken, if it goes well, consider the mutex to be taken
   */
  addMasterMutexFunctions(id, funcTake, funcRelease) {
    this.masterMutexValidationFunctions.push({
      id,
      funcTake,
      funcRelease,
    });
  }
}