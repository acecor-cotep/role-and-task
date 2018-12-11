//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AHandler from './AHandler.js';
import RoleAndTask from '../../RoleAndTask.js';

/**
 * This class handle Task for the process
 * Meaning launching a Task, stop a Task
 *
 * data => [{
 *    name: String,
 *    color: String,
 *    id: Number,
 *    idsAllowedRole: [Number],
 *    obj: ATask,
 * }],
 *
 * (For example with Role)
 *
 * Call -> constructor(data, mapTaskConstantAndObject);
 */
export default class TaskHandler extends AHandler {
  /**
   * Get all active task in array
   */
  getAllActiveTasks() {
    return this.getAllSomething()
      .filter(x => x.isActive());
  }

  /**
   * Get infos tasks relative to the type of tasks
   */
  async getInfosFromAllActiveTasks() {
    const activeTasks = this.getAllActiveTasks();

    // If there is no active tasks, no infos to retrieve
    if (!activeTasks.length) return [];

    const ret = await Promise.all(activeTasks.map(x => x.gatherInfosFromTask())) || [];

    return ret.map((x, xi) => ({
      ...x,

      idTask: activeTasks[xi].id,
    }));
  }

  /**
   * To all tasks apply the new eliot state
   * @param {Number} eliotState
   * @param {Number} oldEliotState
   */
  async applyNewEliotState(eliotState, oldEliotState) {
    const activeTasks = this.getAllActiveTasks();

    // If there is no active tasks, no infos to retrieve
    if (!activeTasks.length) return [];

    await Promise.all(activeTasks.map(x => x.applyNewEliotState(eliotState, oldEliotState)));

    return true;
  }

  /**
   * Start the given Task
   * @param {Number} idTask
   * @param {Object} args
   */
  async startTask(idTask, args) {
    const ret = await this.startSomething(idTask, args);

    RoleAndTask.getInstance()
      .displayMessage({
        str: `[TaskHandler] Task N°${idTask} started`.green,
      });

    return ret;
  }

  /**
   * Stop the given Task
   * @param {Number} idTask
   * @param {Object} args
   */
  async stopTask(idTask, args) {
    RoleAndTask.getInstance()
      .displayMessage({
        str: `[TaskHandler] Ask Task N°${idTask} to stop`.blue,
      });

    const ret = await this.stopSomething(idTask, args);

    RoleAndTask.getInstance()
      .displayMessage({
        str: `[TaskHandler] Task N°${idTask} stoped`.green,
      });

    return ret;
  }

  /**
   * Stop all the running Tasks
   * @param {?Object} args
   */
  async stopAllTask(args = {}) {
    return this.stopAllSomething(args);
  }

  /**
   * Get a list of running Task status (active or not)
   */
  getTaskListStatus() {
    return this.getSomethingListStatus();
  }

  /**
   * Get a task
   * @param {idTask}
   */
  async getTask(idTask) {
    return this.getSomething(idTask);
  }
}
