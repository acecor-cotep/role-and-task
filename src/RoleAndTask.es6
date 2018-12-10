import CONSTANT from './Utils/CONSTANT/CONSTANT.js';

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

    // Contains all the tasks referenced
    this.tasks = [
      ...Object.keys(CONSTANT.DEFAULT_TASK)
      .map(x => CONSTANT.DEFAULT_TASK[x]),
    ];

    // Contains all the roles referenced
    this.roles = [
      ...Object.keys(CONSTANT.DEFAULT_ROLE)
      .map(x => CONSTANT.DEFAULT_ROLE[x]),
    ];

    instance = this;

    return instance;
  }

  /**
   * Singleton getter
   */
  static getInstance() {
    return instance || new RoleAndTask();
  }

  /*
   ***********************************************************************************************************
   *
   *                          PUBLIC METHODS TO USE
   *
   ***********************************************************************************************************
   */

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

    this.systemBoot
      .launch(this.launchMasterSlaveConfigurationFile);
  }

  /**
   * Launch the system ** can be called static **
   */
  static boot() {
    RoleAndTask.getInstance()
      .boot();
  }

  /**
   * Setup the name of the file to read in order to get the configuration
   */
  setLaunchConfigurationFile(filePath) {
    this.launchMasterSlaveConfigurationFile = filePath;
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
   *   name: String,
   *   color: String,
   *   closureHierarchy: Number,
   *   idsAllowedRole: [String],
   *   obj: ATask,
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
   * Declare the given task to the task system
   *
   * {
   *   name: String,
   *   color: String,
   *   closureHierarchy: Number,
   *   idsAllowedRole: [Number],
   *   obj: ATask,
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
