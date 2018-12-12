import CONSTANT from './Utils/CONSTANT/CONSTANT.js';
import Utils from './Utils/Utils.js';
import RoleHandler from './RoleSystem/Handlers/RoleHandler.js';

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

    // Set the Master Slave Configuration File to load
    this.launchMasterSlaveConfigurationFile = false;

    // Path to the entry point of your program, we use to pop a new slave
    this.pathToEntryFile = false;

    // Contains all the tasks referenced
    this.tasks = [
      ...Object.keys(CONSTANT.DEFAULT_TASK)
      .map(x => CONSTANT.DEFAULT_TASK[x]),
    ].filter(x => x.id !== -1);

    // Contains all the roles referenced
    this.roles = [
      ...Object.keys(CONSTANT.DEFAULT_ROLE)
      .map(x => CONSTANT.DEFAULT_ROLE[x]),
    ].filter(x => x.id !== -1);

    // Contains all the states the system can have
    this.states = [
      ...Object.keys(CONSTANT.DEFAULT_STATES)
      .map(x => CONSTANT.DEFAULT_STATES[x]),
    ];

    // Array where we store the functions to call when the state change
    this.stateChangeCallbacks = [];

    // The state of eliot patform
    this.eliotState = CONSTANT.DEFAULT_STATES.LAUNCHING;

    // All the orders in a row to change the eliot state
    this.eliotStateChangeWaitingList = [];

    // Are we quitting?
    this.quitOrder = false;

    // Are we displaying the logs ?
    this.displayLog = true;

    // Do we makes the error to be fatal ?
    this.makesErrorsFatal = false;

    // Handle the signals
    this.handleSignals();

    instance = this;

    return instance;
  }

  /**
   * Singleton getter
   */
  static getInstance() {
    return instance || new RoleAndTask();
  }

  /**
   * Get the good element to treat (Look at specific behavior described into lookAtEliotStateChangePipe comment)
   * (If there is actually something in progress, do nothing)
   */
  getEliotStateChangeToTreat() {
    // No change to perform
    if (!this.eliotStateChangeWaitingList.length) return false;

    let inProgress = false;
    let errorElement = false;

    this.eliotStateChangeWaitingList.some((x) => {
      // We do nothing if something is in progress exept if error
      if (x.inProgress) inProgress = true;

      if (x.eliotState.id === CONSTANT.DEFAULT_STATES.ERROR.id) {
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
    return this.eliotStateChangeWaitingList[0];
  }

  /**
   * Some eliot element got treated, remove them from the pipe
   * @param {Object} elem
   */
  eliotChangeElementGotTreated(elem) {
    this.eliotStateChangeWaitingList = this.eliotStateChangeWaitingList.filter(x => x !== elem);

    // look if there is something else to do
    this.lookAtEliotStateChangePipe();
  }

  /**
   * Send the message saying the state change to whom is interested to know
   */
  spreadStateToListener() {
    this.stateChangeCallbacks.forEach(({
      callback,
    }) => {
      setImmediate(() => callback(this.states.find(x => x.id === this.eliotState.id)), 0);
    });
  }

  /**
   * Look at the eliotStateChangeWaitingList array, and perform an eliot state change if we need to
   * Specific behavior:
   *
   * (1) Error change state always pass first
   * (2) When you want to change the state as something already true, resolve() directly
   */
  async lookAtEliotStateChangePipe() {
    const elementToTreat = this.getEliotStateChangeToTreat();

    // Nothing to do
    if (!elementToTreat) return false;

    elementToTreat.inProgress = true;

    // If the state is already the good one
    if (elementToTreat.eliotState.id === this.eliotState.id) {
      // Resolve the eliot change as a success
      elementToTreat.resolve();

      return this.eliotChangeElementGotTreated(elementToTreat);
    }

    const oldEliotState = this.eliotState;

    this.eliotState = elementToTreat.eliotState;

    try {
      const role = await this.getSlaveNorMaster();

      // If we are the master - handle it
      if (role.id === CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id) {
        const ret = await role.handleEliotStateChange(elementToTreat.eliotState, oldEliotState);

        // Say to everyone which is listening that the state changed
        this.spreadStateToListener();

        elementToTreat.resolve(ret);

        return this.eliotChangeElementGotTreated(elementToTreat);
      }

      // If we are the slave - Do nothing here (we just set the this.eliotState)
      elementToTreat.resolve();

      return this.eliotChangeElementGotTreated(elementToTreat);
    } catch (err) {
      elementToTreat.reject(err);

      return this.eliotChangeElementGotTreated(elementToTreat);
    }
  }

  /**
   * Launch the system
   *
   * We have to load dynamically systemBoot to avoid recursive import
   */
  boot() {
    const SystemBoot = require('./systemBoot/systemBoot.js')
      .default;

    this.systemBoot = new SystemBoot()
      .initialization();

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
   * Getter
   */
  getMakesErrorFatal() {
    return this.makesErrorsFatal;
  }

  /**
   * Do we exit the processes after any error ?
   */
  setMakesErrorFatal(makesErrorsFatal) {
    this.makesErrorsFatal = makesErrorsFatal;
  }

  /**
   * Getter
   */
  getDisplayLog() {
    return this.displayLog;
  }

  /**
   * Are we displaying messages or cut them all of ?
   */
  setDisplayLog(displayLog) {
    this.displayLog = displayLog;
  }

  /**
   * Getter
   */
  getDisplayTask() {
    return this.displayTask;
  }

  /**
   * Set the task which will gonna handle the display, if there is not specified, the display is going to be made in stdout
   *
   * We are waiting for a task id
   */
  setDisplayTask(displayTask) {
    this.displayTask = displayTask;
  }

  /**
   * Getter
   */
  getPathToEntryFile() {
    return this.pathToEntryFile;
  }

  /**
   * Setup the entry point of your program
   *
   * We we are launching new slaves, we gonna use it
   */
  setPathToEntryFile(pathToEntryFile) {
    this.pathToEntryFile = pathToEntryFile;
  }

  /**
   * Setup the name of the file to read in order to get the configuration
   */
  setLaunchConfigurationFile(filePath) {
    this.launchMasterSlaveConfigurationFile = filePath;
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
  async getActualRole(possibilities, i) {
    // If there is no more possibilities - Error
    if (i >= possibilities.length) throw new Error('EXXXX : No role available');

    // Try one
    const role = await this.roleHandler.getRole(possibilities[i]);

    // If its not active, do nothing
    if (!role.isActive()) {
      // Try next
      return false;
    }

    // Its good we can stop now
    return role;
  }

  /**
   * Get the slave role nor the master
   * Take the first that is active
   */
  async getSlaveNorMaster() {
    return Utils.promiseCallUntilTrue({
      functionToCall: this.getActualRole,
      context: this,

      args: [
        this.roles.map(x => x.id),
      ],
    });
  }

  /**
   * Change the eliot state
   * Role master: Set this.eliotState & spread the news to itselfs tasks and slaves
   * Role slate: Set the this.eliotState
   */
  changeEliotState(idEliotState) {
    return new Promise((resolve, reject) => {
      // Push the order in the list of state change to perform
      this.eliotStateChangeWaitingList.push({
        resolve,
        reject,
        eliotState: this.states.find(x => x.id === idEliotState),
        inProgress: false,
      });

      this.lookAtEliotStateChangePipe();
    });
  }

  /**
   * Get the name of the task who asked for the display
   */
  static getTheTaskWhoPerformTheDisplay(role) {
    const activeTasks = role.getTaskHandler()
      .getAllActiveTasks();

    if (!activeTasks.length) return 'unknown';

    return activeTasks[0].name;
  }

  /**
   * Handle the display message throught the slaves and master
   * If we are master we display the message
   * If we are a slave we give the messsage to the master
   * @param {Object} param
   */
  async displayMessage(param) {
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
  }

  /**
   * Here we come when an error happened on the system and we want to deal with it,
   * If we are the master, we tell ourselves about it
   * If we are a slave or ... we tell the master about it
   */
  async errorHappened(err) {
    // Error happens
    Utils.displayMessage({
      str: String((err && err.stack) || err),

      out: process.stderr,
    });

    try {
      const role = await this.getSlaveNorMaster();

      if (role.id !== CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id) {
        // Send a message to the master
        return role.tellMasterErrorHappened(err);
      }

      try {
        // If we are the master ourselves, we put eliot in error
        await this.changeEliotState(CONSTANT.DEFAULT_STATES.ERROR.id);

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
          .getMakesErrorFatal()) {
          RoleAndTask.exitEliotUnproperDueToError();
        }
      } catch (e) {
        // We exit ELIOT, nothing more we can do
        // We locally display the error so it will finish into the node-error.log file
        RoleAndTask.exitEliotMsg('Exit eliot unproper ERROR HAPPENED', err, e);

        // We use setTimeout tho if there is some others things to do before the quit it will
        RoleAndTask.exitEliotUnproperDueToError();
      }
    } catch (e) {
      RoleAndTask.exitEliotMsg('Exit eliot unproper ERROR HAPPENED CATCH', err, e);

      // We use setTimeout tho if there is some others things to do before the quit it will
      RoleAndTask.exitEliotUnproperDueToError();
    }

    return false;
  }

  /**
   * Display messages about exiting eliot in errorHappened
   */
  static exitEliotMsg(txt, err, e) {
    // We exit ELIOT, nothing more we can do
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
      str: 'Exit eliot unproper ERROR HAPPENED CATCH',
      out: process.stderr,
    });
  }

  /**
   * Make the master to quit every slaves and every task
   * DO NOT QUIT THE APP
   */
  async makeTheMasterToQuitEverySlaveAndTask() {
    // Do nothing when we already got an order for closure
    if (this.quitOrder) return false;

    this.quitOrder = true;

    const role = await this.getSlaveNorMaster();

    // If we are the master - handle it
    if (role.id !== CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id) throw new Error('EXXXX : Closure not possible in a slave');

    /**
     * We change the eliot state to CLOSE
     */
    await this.changeEliotState(CONSTANT.DEFAULT_STATES.CLOSE.id);

    return this.quit();
  }

  /**
   * Properly quit the app if we are on master
   * Ignore if we are inside something else
   */
  async makeTheMasterToQuitTheWholeApp() {
    // If the state is LAUNCHING do not quit the app
    if (this.eliotState.id === CONSTANT.DEFAULT_STATES.LAUNCHING.id) {
      this.displayMessage({
        str: 'Cannot close ELIOT when the state is LAUNCHING',
      });

      return;
    }

    try {
      const quit = await this.makeTheMasterToQuitEverySlaveAndTask();

      if (quit) RoleAndTask.exitEliotGood();

      // Do nothing if quit equal to false
      // ...
    } catch (err) {
      RoleAndTask.getInstance()
        .errorHappened(err);
    }
  }

  /**
   * We exit ELIOT unproperly due to an error that can't be fixed regulary
   * (Ex: lose the communication between the slave and the master and we are the slave)
   */
  static exitEliotUnproperDueToError() {
    // Exit after a timeout to let the system makes the displays
    setTimeout(() => process.exit(1), CONSTANT.TIMEOUT_LEAVE_ELIOT_UNPROPER);
  }

  /**
   * We exit ELIOT when everything had been closed the right way
   */
  static exitEliotGood() {
    Utils.displayMessage({
      str: 'Exit eliot good',
      out: process.stderr,
    });

    process.exit(0);
  }

  /**
   * Handle signals
   */
  handleSignals() {
    // Exit ELIOT properly
    const signalActionProper = async () => {
      const role = await this.getSlaveNorMaster();

      // If we are the master - handle it - if we are a slave ignore it
      if (role.id !== CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id) return;

      this.makeTheMasterToQuitTheWholeApp();
    };

    // Exit ELIOT unproperly
    const signalActionUnproper = () => {
      RoleAndTask.exitEliotUnproperDueToError();
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
  async spreadDataToEveryLocalTask({
    dataName,
    data,
    timestamp,
    limitToTaskList,
  }) {
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
  }

  /**
   * THIS METHOD WORK ONLY IN THE MASTER
   * (It get called by HandleEliotTask)
   *
   * It returns in an array the whole system pids (Master + Slaves processes)
   */
  async getFullSystemPids() {
    const role = await this.getMasterRole();

    return role.getFullSystemPids();
  }

  /**
   * Get the master role (error if we are not in master role process)
   */
  async getMasterRole() {
    const roleMaster = await this.getRoleHandler()
      .getRole(CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id);

    // If its not active, do nothing
    if (!roleMaster.isActive()) throw new Error('EXXXX : Master is not active in getMasterRole');

    // Its good
    return roleMaster;
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
  async quit() {
    const role = await this.getSlaveNorMaster();

    await role.stop();

    return true;
  }

  /*
   ********************************************************************
   *               STATIC METHODS TO ACCESS DIRECTLY
   ********************************************************************
   */

  /**
   * Declare a new Role
   *
   * {
   *   name: String,
   *   id: String,
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
}
