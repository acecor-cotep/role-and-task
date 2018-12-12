//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// import
import Errors from './Errors.js';
import Utils from './Utils.js';
import CONSTANT from './CONSTANT/CONSTANT.js';

/**
 * Define a pattern that can be used when you define a command implementation
 */
export default class PromiseCommandPattern {
  /**
   * Constructor
   *
   * OLD PARAMS
   *
   * @param {Function} funcToExecute
   * @param {Array} classes
   * @param {Array} lock
   * @param {Boolean} stackTrace - Add a stackTrace point when passing by here
   *
   * NEW PARAM
   * {{
   *   // Function to execute
   *   func: Function,
   *
   *   // Function to call to handle the error
   *   error: Function,
   *
   *   // Do we retry when the error is a transaction error?
   *   transactionRetry: Boolean,
   *
   *   lock: {
   *    previous: Array,
   *    new: [],
   *   },
   *
   *   classes: Array,
   *
   *   // if the attribute is set, we renew the data inside the logInfos before to use it, according to the name of the function called
   *   logInfos: Object,
   * }}
   *
   */
  constructor({
    func,
    error,
  }) {
    // If we have the old system (with asyn execute new code)
    this.funcToExecute = func;

    this.callerFunctionName = Utils.getFunctionName(CONSTANT.NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN);

    this.error = error || false;

    return this.executeAsync();
  }

  /**
   * Execute the fuinction to execute which is the purpose of PromiseCommandPattern
   */
  async executeFunctionToExecute() {
    try {
      // Classes the user asked for
      // Functions the users wants to access @example Spread a news
      return this.funcToExecute.call(null);
    } catch (err) {
      const error = !Errors.staticIsAnError(err) ?
        new Errors('EUNEXPECTED', String((err && err.stack) || err), this.callerFunctionName) :
        err;

      // If the user have a special error use, use it
      if (this.error) {
        await this.error(error);
      } else {
        throw error;
      }

      return false;
    }
  }

  /**
   * Execute the command using async syntax
   */
  async executeAsync() {
    try {
      // Execute the function to execute (purpose of PromiseCommandPattern)
      return this.executeFunctionToExecute();
    } catch (err) {
      // PARTICULAR CASE TO HANDLE QUIT
      // PARTICULAR CASE TO HANDLE QUIT
      if (err === CONSTANT.QUIT) return err;
      // PARTICULAR CASE TO HANDLE QUIT
      // PARTICULAR CASE TO HANDLE QUIT

      const error = !Errors.staticIsAnError(err) ?
        new Errors('EUNEXPECTED', String((err && err.stack) || err), this.callerFunctionName) :
        err;

      if (this.stackTrace) throw Errors.shortcutStackTraceSpecial(error, this.callerFunctionName);

      throw error;
    }
  }
}
