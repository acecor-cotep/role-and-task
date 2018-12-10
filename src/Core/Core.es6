//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * Core is the main class that handle big functions and keep all main data
 */
// Includes
import Utils from '../Utils/Utils.js';
import CONSTANT from '../Utils/CONSTANT/CONSTANT.js';
import RoleHandler from '../RoleSystem/Handlers/RoleHandler.js';
import RoleAndTask from '../RoleAndTask.js';

// ------------------------------

let instance = false;

/**
 * Handle high levels functions that permit to manage the application (perform commands, handle database, APIs ...)
 *
 * SINGLETON CLASS
 */
export default class Core {
  /**
   * constructor
   */
  constructor() {
    if (!instance) {
      this.startDate = new Date();

      // Handle the signals
      this.handleSignals();

      // Init every property
      this.initProperties();

      // Get the roles we handle
      const roles = RoleAndTask.getInstance()
        .getRoles();

      this.roleHandler = new RoleHandler(roles);

      instance = this;
    }

    return instance;
  }

  /**
   * Initialize the properties
   */
  initProperties() {
    // Are we quitting?
    this.quitOrder = false;

    // The state of eliot patform
    this.eliotState = CONSTANT.ELIOT_STATE.LAUNCHING;

    // All the orders in a row to change the eliot state
    this.eliotStateChangeWaitingList = [];
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

      if (x.eliotState === CONSTANT.ELIOT_STATE.ERROR) {
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
    if (elementToTreat.eliotState === this.eliotState) {
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

        console.log(`State : ${CONSTANT.ELIOT_STATE_TRANSLATION[elementToTreat.eliotState]}`);

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
   * Change the eliot state
   * Role master: Set this.eliotState & spread the news to itselfs tasks and slaves
   * Role slate: Set the this.eliotState
   */
  changeEliotState(eliotState) {
    return new Promise((resolve, reject) => {
      // Push the order in the list of state change to perform
      this.eliotStateChangeWaitingList.push({
        resolve,
        reject,
        eliotState,
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
      console.log(param);

      const role = await this.getSlaveNorMaster();

      // Handle the fact we are trying to display an object
      const isString = Utils.isAString(param.str);

      if (isString) {
        return role.displayMessage({
          ...param,

          // Add the task who perform the display
          from: Core.getTheTaskWhoPerformTheDisplay(role),

          time: Date.now(),
        });
      }

      const newParam = {
        ...param,

        // Add the task who perform the display
        from: Core.getTheTaskWhoPerformTheDisplay(role),

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
        await this.changeEliotState(CONSTANT.ELIOT_STATE.ERROR);

        // We did sent the message :)
        // Display the error message
        this.displayMessage({
          str: String((err && err.stack) || err),

          tags: [
            CONSTANT.MESSAGE_DISPLAY_TAGS.ERROR,
          ],
        });

        // If the errors are supposed to be fatal, exit!
        if (CONSTANT.MAKES_ERROR_FATAL) {
          Core.exitEliotUnproperDueToError();
        }
      } catch (e) {
        // We exit ELIOT, nothing more we can do
        // We locally display the error so it will finish into the node-error.log file
        Core.exitEliotMsg('Exit eliot unproper ERROR HAPPENED', err, e);

        // We use setTimeout tho if there is some others things to do before the quit it will
        Core.exitEliotUnproperDueToError();
      }
    } catch (e) {
      Core.exitEliotMsg('Exit eliot unproper ERROR HAPPENED CATCH', err, e);

      // We use setTimeout tho if there is some others things to do before the quit it will
      Core.exitEliotUnproperDueToError();
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
    await this.changeEliotState(CONSTANT.ELIOT_STATE.CLOSE);

    return this.quit();
  }

  /**
   * Properly quit the app if we are on master
   * Ignore if we are inside something else
   */
  async makeTheMasterToQuitTheWholeApp() {
    // If the state is LAUNCHING do not quit the app
    if (this.eliotState === CONSTANT.ELIOT_STATE.LAUNCHING) {
      this.displayMessage({
        str: 'Cannot close ELIOT when the state is LAUNCHING',
      });

      return;
    }

    try {
      const quit = await this.makeTheMasterToQuitEverySlaveAndTask();

      if (quit) Core.exitEliotGood();

      // Do nothing if quit equal to false
      // ...
    } catch (err) {
      Core.getInstance()
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
      Core.exitEliotUnproperDueToError();
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
   * Get the unique instance of the class
   * @return {Core}
   */
  static getInstance() {
    return instance || new Core();
  }

  // ===========================================================================
  //                        ROLE/TASK COMMUNICATION
  // ===========================================================================

  /**
   * Send data from here to every tasks of ELIOT.
   * We are going to send messages from communication channel's to every Slave.
   *
   * @param {String} dataName
   * @param {Object} data
   * @param {Date} timestamp
   */
  async sendDataToEveryELIOTTaskWhereverItIs({
    // The name that represent the data
    dataName,

    // The data to send
    data,

    // Date of the data
    timestamp = new Date(),

    // limit to given tasks
    limitToTaskList = false,
  }) {
    const {
      DATABASE_MAINTAINANCE,
    } = CONSTANT.ELIOT_STATE;

    const {
      COLLECTION_CRUD,
      SCREEN_STATUS_NEWS,
      BREAKDOWN_PARAMETER_NEWS,
    } = CONSTANT.GENERIC_DATA_NEWS;

    // If the eliotState is one of the specified and the message type one of the specified we do not send the message
    if (Utils.checkThatAtLeastOneElementOfArray1ExistInArray2([
        DATABASE_MAINTAINANCE,
      ], [
        this.eliotState,
      ]) && Utils.checkThatAtLeastOneElementOfArray1ExistInArray2([
        dataName,
      ], [
        COLLECTION_CRUD,
        SCREEN_STATUS_NEWS,
        BREAKDOWN_PARAMETER_NEWS,
      ])) {
      return true;
    }

    const role = await this.getSlaveNorMaster();

    return role.sendDataToEveryELIOTTaskWhereverItIs({
      dataName,
      data,
      timestamp,
      limitToTaskList,
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

  // ===========================================================================

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

    this.initProperties();

    return true;
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
    const roleMaster = await this.roleHandler.getRole(CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id);

    // If its not active, do nothing
    if (!roleMaster.isActive()) throw new Error('EXXXX : No role available');

    // Its good
    return roleMaster;
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
        [
          CONSTANT.DEFAULT_ROLE.SLAVE_ROLE.id,
          CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id,
        ],
      ],
    });
  }

  /**
   * Get the start date of the software
   * @return {number}
   */
  getStartDate() {
    return this.startDate;
  }
}
