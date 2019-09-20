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
export default abstract class AHandler {
  protected something: any;

  /**
   * @param {Object} data
   * @param {{[String]: Class}} mapSomethingConstantAndObject
   * Map that match the constant of something with the actual Something classes
   */
  constructor(data: any) {
    // List of available roles
    // A Something is defined as SINGLETON
    // A Something can be applied only once
    this.something = data;
  }

  /**
   * Ask something from Something
   */
  public genericAskingSomethingToDoSomething(idSomething: string | -1, args: any, funcToCall: string): Promise<any> {
    return PromiseCommandPattern({
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
   */
  public startSomething(idSomething: string | -1, args: any): Promise<any> {
    return PromiseCommandPattern({
      func: () => this.genericAskingSomethingToDoSomething(idSomething, args, 'start'),
    });
  }

  /**
   * Stop the given Something
   */
  public stopSomething(idSomething: string | -1, args: any): Promise<any> {
    return PromiseCommandPattern({
      func: () => this.genericAskingSomethingToDoSomething(idSomething, args, 'stop'),
    });
  }

  /**
   * Stop all the running Something
   */
  public stopAllSomething(args: any = []): Promise<any> {
    return PromiseCommandPattern({
      func: async () => {
        const objToStop = Object.keys(this.something)
          .reduce((tmp: any[], x: string) => {
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
   */
  public getSomething(idSomething: string | -1): Promise<any> {
    return PromiseCommandPattern({
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
  public getAllSomething(): any[] {
    return Object.keys(this.something)
      .map(x => this.something[x].obj);
  }

  /**
   * Get a list of running something status (active or not)
   */
  public getSomethingListStatus(): {
    name: string,
    id: string,
    isActive: boolean
  }[] {
    return Object.keys(this.something)
      .reduce((tmp: { name: string, id: string, isActive: boolean }[], x: string) => {
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
