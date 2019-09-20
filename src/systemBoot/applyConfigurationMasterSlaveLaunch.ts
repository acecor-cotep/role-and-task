//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import Utils from '../Utils/Utils.js';
import Errors from '../Utils/Errors.js';
import CONSTANT from '../Utils/CONSTANT/CONSTANT.js';
import RoleAndTask from '../RoleAndTask.js';
import PromiseCommandPattern from '../Utils/PromiseCommandPattern.js';

class LocalClass {
  /**
   * Start the master role on current process
   */
  protected static startMasterRoleOnCurrentProcess(roleHandler, optionsMaster) {
    return PromiseCommandPattern({
      func: async () => {
        const role = await roleHandler.getRole(CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id);

        // Role here is a AMaster so we can use method of it
        role.pathToEntryFile = RoleAndTask.getInstance().pathToEntryFile;

        role.displayTask = RoleAndTask.getInstance().displayTask;

        // Start the master on the current process
        await roleHandler.startRole(CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id, optionsMaster);

        return role;
      },
    });
  }

  /**
   * Start all given task for the given slave
   * @param {Object} masterRole
   * @param {Object} slave
   * @param {[{ id: String, args: Object }]} tasks
   */
  static startXTasksForSlave(masterRole, slave, tasks) {
    // Start a tasks
    return PromiseCommandPattern({
      func: () => Promise.all(tasks.map(x => masterRole.startTaskToSlave(slave.programIdentifier, x.id, x.args))),
    });
  }

  /**
   * Add a new slaves with the given tasks on it
   * @param {Object} masterRole
   * @param {[{ id: String, args: Object }]} tasks
   */
  static addNewSlaveWithGivenTasks(masterRole, tasks = []) {
    return PromiseCommandPattern({
      func: async () => {
        // Add a new slave
        const slave = await masterRole.startNewSlave();

        await LocalClass.startXTasksForSlave(masterRole, slave, tasks);

        return slave;
      },
    });
  }

  /**
   * Start all given task for the master
   * @param {Object} masterRole
   * @param {[{ id: String, args: Object }]} tasks
   */
  static startXTasksForMaster(masterRole, tasks: { id: string, args: any }[] = []) {
    return PromiseCommandPattern({
      func: () => Promise.all(tasks.map(x => masterRole.startTask(x.id, x.args))),
    });
  }

  /**
   * Start multiple slaves and theirs related tasks
   *
   * @param {Object} masterRole
   * @param {[{
   *       name: String,
   *       tasks: [{
   *          id: String,
   *          args: {},
   *       }],
   *    }]} slaves
   *
   * ret => [{
   *    slave: Object,
   *    name: String,
   * }]
   */
  static startMultipleSlavesAndTheirsTasks(masterRole, slaves) {
    return PromiseCommandPattern({
      func: async () => {
        // Perform one launch
        const rets = await Promise.all(slaves.map(x => LocalClass.addNewSlaveWithGivenTasks(masterRole, x.tasks)));

        return rets.map((x, xi) => ({
          slave: x,
          name: slaves[xi].name,
        }));
      },
    });
  }

  /**
   * Connect all tasks to each othes following the configuration
   * @param {Object} masterRole
   *
   *  @param {[{
   *    slave: Object,
   *    name: String,
   * }]} slaves
   *
   * @param {[{
   *        id_task_server: String,
   *        name_slave_client: String,
   *        id_task_client: String,
   *        args: {},
   *    }]} taskConnect
   */
  static connectTasksTogethers(masterRole, slaves, tasksConnects) {
    return PromiseCommandPattern({
      func: () => Utils.executePromiseQueue(tasksConnects.map(x => ({
        functionToCall: LocalClass.connectOneTaskWithAnOther,

        context: LocalClass,

        args: [
          masterRole,
          slaves,
          x,
        ],
      }))),
    });
  }

  /**
   * Connect one task
   */
  static connectOneTaskWithAnOther(masterRole, slaves, taskConnect) {
    return PromiseCommandPattern({
      func: async () => {
        const goodSlaveClient = slaves.find(x => x.name === taskConnect.name_slave_client);

        // If the configuration is bad
        // EMPTY FIELD MEANS THE CLIENT IS THE MASTER
        if (!goodSlaveClient && taskConnect.name_slave_client !== '') {
          throw new Errors('EXXXX', 'Bad task connection configuration');
        }

        // Connect one
        if (!goodSlaveClient) {
          return masterRole.connectMasterToTask(
            taskConnect.id_task_client,
            taskConnect.id_task_server,
            taskConnect.args,
          );
        }

        return masterRole.connectTaskToTask(
          (goodSlaveClient && goodSlaveClient.slave.programIdentifier) || false,
          taskConnect.id_task_client,
          taskConnect.id_task_server,
          taskConnect.args,
        );
      },
    });
  }

  /**
   * Check the configuration file
   * @param {String} conf
   */
  static checkConfigurationFile(conf) {
    return PromiseCommandPattern({
      func: async () => {
        const checkTask = data => !data.some(task => [
          () => Utils.isAJSON(task),

          () => Utils.isAString(task.id),

          () => Utils.isAJSON(task.args),
        ].some(x => !x()));

        //
        //  We perform sequentials checks
        //  (Same as if/if/if/if/if/if... but much more sexier 8D )
        [
          () => Utils.isAJSON(conf.master),

          () => Utils.isAnArray(conf.slaves),

          () => Utils.isAnArray(conf.task_connect),

          //
          // Master body
          //
          () => Utils.isAJSON(conf.master.options),

          () => Utils.isAnArray(conf.master.tasks),

          // Master -> Tasks
          () => checkTask(conf.master.tasks),

          //
          // Slaves body
          //
          () => !conf.slaves.some(slave => [
            () => Utils.isAJSON(slave),

            () => Utils.isAString(slave.name),

            () => Utils.isAnArray(slave.tasks),

            () => checkTask(slave.tasks),
          ].some(x => !x())),

          //
          // Task connect body
          //
          () => !conf.task_connect.some(body => [
            () => Utils.isAJSON(body),

            () => Utils.isAString(body.id_task_server) && body.id_task_server.length > 0,

            () => Utils.isAString(body.name_slave_client),

            () => Utils.isAString(body.id_task_client) && body.id_task_client.length > 0,

            () => Utils.isAJSON(body.args),
          ].some(x => !x())),

        ].forEach((x, xi) => {
          // Put xi to debug in case
          if (!x()) throw new Errors('E8092', `${String(xi)}`);
        });

        return true;
      },
    });
  }

  /**
   * Function to apply a master and slaves configuration to launch
   *
   * @param {Object} conf
   *
   * {
   *    // Master configuration
   *    master: {
   *       options: {},
   *       tasks: [{
   *         id: String,
   *         args: {},
   *       }, ...],
   *    },
   *    // Slaves configuration
   *    slaves: [{
   *       name: String,
   *       tasks: [{
   *          id: String,
   *          args: {},
   *       }, ...],
   *    }],
   *    // Define the connection between the slave/master tasks
   *    task_connect: [{
   *        id_task_server: String,
   *        name_slave_client: String,
   *        id_task_client: String,
   *        args: {},
   *    }],
   * }
   */
  static applyConfigurationMasterSlaveLaunch(conf: any) {
    return PromiseCommandPattern({
      func: async () => {
        const roleHandler = RoleAndTask.getInstance()
          .getRoleHandler();

        // Check the configuration to be good
        await LocalClass.checkConfigurationFile(conf);

        // Start the master
        const masterRole = await LocalClass.startMasterRoleOnCurrentProcess(roleHandler, conf.master.options);

        const [, slaves] = await Promise.all([
          // Start the master tasks
          LocalClass.startXTasksForMaster(masterRole, conf.master.tasks),

          // Start all slaves and theirs tasks
          LocalClass.startMultipleSlavesAndTheirsTasks(masterRole, conf.slaves),
        ]);

        // Connect all tasks to each othes following the configuration
        return LocalClass.connectTasksTogethers(masterRole, slaves, conf.task_connect);
      },
    });
  }
}

// Export the function to use
export default (conf: any) => LocalClass.applyConfigurationMasterSlaveLaunch(conf);
