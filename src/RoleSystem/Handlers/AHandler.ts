//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import Utils from '../../Utils/Utils.js';
import Errors from '../../Utils/Errors.js';
import PromiseCommandPattern from '../../Utils/PromiseCommandPattern.js';

/**
 * This class handle something
 */
export default class AHandler {
  /**
   * @param {Object} data
   * @param {{[String]: Class}} mapSomethingConstantAndObject
   * Map that match the constant of something with the actual Something classes
   */
  constructor(data) {
    // List of available roles
    // A Something is defined as SINGLETON
    // A Something can be applied only once
    this.something = data;
  }

  /**
   * Ask something from Something
   * @param {Number} idRole
   * @param {Array} args
   * @param {Function} funcToCall
   */
  genericAskingSomethingToDoSomething(idSomething, args, funcToCall) {
    return new PromiseCommandPattern({
      func: async () => {
        // Cannot apply an abstract Something
        if (idSomething === -1) throw new Errors('E7001');

        // Look in our array if we found the Something
        const elem = Object.keys(this.something)
          .find(x => this.something[x].id === idSomething);

        // Cannot find the given id
        if (!elem) throw new Errors('E7002', `idSomething: ${idSomething}`);

        // If we have no object associated to the Something in the code
        if (!this.something[elem].obj) throw new Errors('EXXXX', 'Cannot find the object to apply/disable (obj in the code)');

        // try to start the Something
        return this.something[elem].obj[funcToCall].call(this.something[elem].obj, args);
      },
    });
  }

  /**
   * Start the given Something
   * @param {Number} idSomething
   * @param {Object} args
   */
  startSomething(idSomething, args) {
    return new PromiseCommandPattern({
      func: () => this.genericAskingSomethingToDoSomething(idSomething, args, 'start'),
    });
  }

  /**
   * Stop the given Something
   * @param {Number} idSomething
   * @param {Array} args
   */
  stopSomething(idSomething, args) {
    return new PromiseCommandPattern({
      func: () => this.genericAskingSomethingToDoSomething(idSomething, args, 'stop'),
    });
  }

  /**
   * Stop all the running Something
   * @param {?Array} args
   */
  stopAllSomething(args = []) {
    return new PromiseCommandPattern({
      func: async () => {
        const objToStop = Object.keys(this.something)
          .reduce((tmp, x) => {
            if (this.something[x].obj && this.something[x].obj.isActive()) tmp.push(this.something[x].id);

            return tmp;
          }, []);

        return Utils.recursiveCallFunction({
          context: this,
          func: this.stopSomething,
          objToIterate: objToStop,
          nameToSend: null,
          nameTakenInDocs: null,
          additionnalParams: args,
        });
      },
    });
  }

  /**
   * Get an object using the id of it
   * @param {String} idSomething
   */
  getSomething(idSomething) {
    return new PromiseCommandPattern({
      func: async () => {
        const elem = Object.keys(this.something)
          .find(x => this.something[x].id === idSomething);

        if (!elem) throw new Errors('EXXXX', `Cannot find obj in the code ${idSomething}`);

        // If we have no object associated to the Something in the code
        if (!this.something[elem].obj) throw new Errors('EXXXX', `Cannot find obj in the code ${JSON.stringify(this.something[elem])}`);

        return this.something[elem].obj;
      },
    });
  }

  /**
   * Get all something in array
   */
  getAllSomething() {
    return Object.keys(this.something)
      .map(x => this.something[x].obj);
  }

  /**
   * Get a list of running something status (active or not)
   */
  getSomethingListStatus() {
    return Object.keys(this.something)
      .reduce((tmp, x) => {
        if (this.something[x].obj) {
          return [
            ...tmp,

            {
              name: this.something[x].name,
              id: this.something[x].id,
              isActive: this.something[x].obj.isActive(),
            },
          ];
        }

        return [
          ...tmp,

          {
            name: this.something[x].name,
            id: this.something[x].id,
            isActive: false,
          },
        ];
      }, []);
  }
}