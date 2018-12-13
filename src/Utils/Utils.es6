//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class contain utilitaries functions
 */

// Includes
import os from 'os';

import moment from 'moment';
import fs from 'fs';
import hjson from 'hjson';
import pusage from 'pidusage';
import childProcess from 'child_process';
import CONSTANT from './CONSTANT/CONSTANT.js';
import Errors from './Errors.js';

/**
 * Contain utilitaries functions
 */
export default class Utils {
  /**
   * Get an unique id (Specific to Program)
   * USE THE PID OF THE APP TO GET AN INTER-PROGRAM UNIQUE IDENTIFIER
   */
  static generateUniqueProgramID() {
    if (!Utils.generatedId) Utils.generatedId = 2;

    Utils.generatedId += 1;

    return `${process.pid}x${Utils.generatedId}`;
  }

  /**
   * Generate a little ID usefull for log for example
   */
  static generateLittleID() {
    return Math.random()
      .toString(36)
      .substr(2, 10);
  }

  /**
   * Generate a random value from min to max
   * @param {Number} min
   * @param {Number} max
   * @param {Boolean} round
   */
  static generateRandom(min, max, round = true) {
    const nb = (Math.random() * ((max - min) + 1)) + min;

    if (round) return Math.floor(nb);

    return nb;
  }

  /**
   * Return the name of thekey that are behind the given value
   * @param {Object} json
   * @param {String} value
   */
  static getJsonCorrespondingKey(json, value) {
    return Object.keys(json)
      .find(x => json[x] === value);
  }

  /**
   * Create a monoline from an array which is usefull when you have a line that is too long
   */
  static monoline(parts) {
    return parts.reduce((str, x) => `${str}${x}`, '');
  }

  /**
   * Call recursively the function given in parameter for each iteration of the object
   * It works for a given function pattern
   * Call resolve with an array that contains results of called functions
   *
   * @param {{
   *  context: Object,
   *
   *  func: Function,
   *
   *  objToIterate: [Object],
   *
   *  // name of the field that is sent to the function
   *  // if its equals to null, it means we have to send data into NON JSON structure
   *  nameToSend: String,
   *
   *  // name of the field we took from the docs to sent to the function,
   *  // if its equals to null, it means the objToIterate is an array that contains directs values
   *  // (DO NOT WORK WITH COLLECTION_ENTRY OBJECTS)
   *  nameTakenInDocs: String,
   *
   *  // to pass in addition to the id  - DO NOT WORK WITH nameToSend = null
   *  additionnalJsonData: Object,
   *
   *  // to pass in addition of the generated json
   *  additionnalParams: [],
   *
   *  _i: ?Number,
   *
   *  _rets: ?Array, // all returns of the functions we called
   * }}
   */
  static async recursiveCallFunction({
    context,
    func,
    objToIterate,
    nameToSend = '_id',
    nameTakenInDocs = '_id',
    additionnalJsonData = {},
    additionnalParams = [],
    _i = 0,
    _rets = [],
  }) {
    if (!objToIterate) return _rets;

    // If our job is done
    if (_i >= objToIterate.length) return _rets;

    // Get the value from the objToIterate following the given parameters
    const val = nameTakenInDocs ? objToIterate[_i][nameTakenInDocs] : objToIterate[_i];

    // Put the val into a JSON or a regular object
    const obj = nameToSend ? {
      [nameToSend]: val,
    } : val;

    // if we have a JSON object and additionnalJsonData
    if (nameToSend) {
      Object.keys(additionnalJsonData)
        .forEach((x) => {
          obj[x] = additionnalJsonData[x];
        });
    }

    // Call the func
    const ret = await func.apply(context, [obj, ...additionnalParams]);

    // Call next
    return Utils.recursiveCallFunction({
      context,
      func,
      objToIterate,
      nameToSend,
      nameTakenInDocs,
      additionnalJsonData,
      additionnalParams,

      _i: _i + 1,

      _rets: (ret ? [
        ..._rets,
        ret,
      ] : _rets),
    });
  }

  /**
   * Get the Ips of the local machine
   */
  static givesLocalIps() {
    try {
      // Get network interfaces
      const interfaces = os.networkInterfaces();

      return Object.keys(interfaces)
        .reduce((tmp, x) => tmp.concat(interfaces[x]), [])
        .filter(iface => iface.family === 'IPv4' && !iface.internal)
        .map(iface => iface.address);
    } catch (err) {
      return String((err && err.stack) || err);
    }
  }

  /**
   * Convert a string to JSON
   * If he cannot parse it, return false
   * @param {String} dataString
   */
  static convertStringToJSON(dataString) {
    return (() => {
      try {
        return JSON.parse(dataString);
      } catch (_) {
        return false;
      }
    })();
  }

  /**
   * Execute a command line
   * By default, set the maxBuffer option to 2GB
   */
  static execCommandLine(cmd, options = {
    maxBuffer: 1024 * 2000,
  }) {
    return new Promise((resolve, reject) => {
      childProcess.exec(cmd, options, (err, res) => {
        if (err) {
          return reject(new Errors('E8191', `${String(err)}`));
        }

        return resolve(res);
      });
    });
  }

  /**
   * Generate a string using the given char repeated x time
   * @param {character} String
   * @param {Number} nb
   */
  static generateStringFromSameChar(character, nb) {
    return character.repeat(nb);
  }

  /**
   * Execute a command line
   * Execute the given onStdout function when stdout datas are given
   * When onStdout is not set, do nothing about the data
   * Execute the given onStderr function when stderr datas are given
   * When onStderr is not set, do nothing about the data
   */
  static execStreamedCommandLine({
    cmd,
    options = [],
    processArray = false,
    onStdout,
    onStderr,
  }) {
    return new Promise((resolve, reject) => {
      const ls = childProcess.spawn(cmd, options);

      if (processArray) {
        processArray.push(ls);
      }

      if (!onStdout) {
        ls.stdout.on('data', () => true);
      } else {
        ls.stdout.on('data', onStdout);
      }

      if (!onStderr) {
        ls.stderr.on('data', () => true);
      } else {
        ls.stderr.on('data', onStderr);
      }

      ls.on('close', (code) => {
        if (code === 'SIGINT') {
          reject(code);
        }

        const index = processArray.indexOf(ls);

        if (index !== -1) {
          processArray.splice(index, 1);
        }

        resolve(code);
      });

      ls.on('error', (err) => {
        const index = processArray.indexOf(ls);

        if (index !== -1) {
          processArray.splice(index, 1);
        }

        reject(new Errors('E8200', `${err.toString()}`));
      });
    });
  }

  /**
   * Sleep some time
   */
  static sleep(timeInMs) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), timeInMs);
    });
  }

  /**
   * Display a message in console
   * @param {{
   *   str: String,
   *   carriageReturn: Boolean,
   *   out: Object,
   *   from: String,
   * }}
   */
  static displayMessage({
    str,
    carriageReturn = true,
    out = process.stdout,
    from = process.pid,
    time = Date.now(),
  }) {
    out.write(`${moment(time).format(CONSTANT.MOMENT_CONSOLE_DATE_DISPLAY_FORMAT)}:${from} > - ${str}${carriageReturn ? '\n' : ''}`);
  }

  /**
   * Read a file asynchronously
   */
  static readFile(filename, options = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, options, (err, data) => {
        if (err) return reject(new Errors('E8088', `filename: ${filename}`, String(err)));

        return resolve(data);
      });
    });
  }

  /**
   * Parse hjson content (Human JSON --> npm module)
   * @param {String} content
   */
  static async parseHjsonContent(content) {
    try {
      return hjson.parse(content);
    } catch (err) {
      throw new Errors('E8089', `${String(err)}`);
    }
  }

  /**
   * DO NOT CALL IT DIRECTLY, it is used by promiseCallUntilTrue
   *
   * RECURSIVE
   */
  static async executePromiseCallUntilTrue({
    functionToCall,
    context,
    args,
    i = 0,
  }) {
    const ret = await functionToCall.apply(context, [
      ...args,

      i,
    ]);

    if (ret !== false && ret.args === void 0) return ret;

    // Call again
    return Utils.executePromiseCallUntilTrue({
      functionToCall,
      context,
      args: ret.args === void 0 ? args : ret.args,

      i: ret.i === void 0 ? i + 1 : ret.i,
    });
  }

  /**
   * Call the given function until it return something different than false
   *
   * If the function returns :
   *
   * false                                -> We make an another call with the same args
   * true                                 -> We stop the calls and return true
   * { args: something }                  -> We make an another call with the new given args
   * { args: something, i: something }    -> We make an another call with the new given args and changing the i
   * anything else                        -> we stop the calls and return wathever it is
   *
   * {
   *   functionToCall,
   *   context,
   *   args,
   *   i = 0,
   * }
   *
   * i is the index you can force to start with instead of 0
   */
  static async promiseCallUntilTrue(conf) {
    return Utils.executePromiseCallUntilTrue(conf);
  }

  /**
   * DO NOT CALL IT DIRECTLY, it is used by promiseQueue
   *
   * RECURSIVE
   */
  static async executePromiseQueue(conf, _rets = [], _i = 0) {
    // Is the job done?
    if (_i >= conf.length) return _rets;

    // Execute one
    const {
      functionToCall,
      context = this,
      args = [],
    } = conf[_i];

    _rets.push(await functionToCall.apply(context, args));

    // Call next
    return Utils.executePromiseQueue(conf, _rets, _i + 1);
  }

  /**
   * Execute the given functions one by one, and the return the ret of them in an array
   *
   * -> it's a Promise.all but one by one instead of parallel
   *
   * [{
   *   // The function you want to call
   *   functionToCall,
   *
   *   // The context to use when you are calling it
   *   context,
   *
   *   // The argument to pass to the functionToCall (must be in an array)
   *   args,
   * }]
   */
  static async promiseQueue(conf) {
    return Utils.executePromiseQueue(conf);
  }

  /**
   * Return the name of the function that call this function
   * IT'S A HACK
   */
  static getFunctionName(numberFuncToGoBack = 1) {
    const err = new Error('tmpErr');

    const splitted = err.stack
      .split('\n');

    // If we cannot succeed to find the good function name, return the whole data
    if (numberFuncToGoBack >= splitted.length) {
      return err.stack;
    }

    const trimmed = splitted[numberFuncToGoBack]
      .trim(' ');

    // If we cannot succeed to find the good function name, return the whole data
    if (!trimmed.length) return err.stack;

    return trimmed.split(' ')[1];
  }

  /**
   * Fire functions that are in the given array and pass args to it
   * @param {[?({func: Function, context: Object},func)]} arrayOfFunction
   * @param {Array} args
   */
  static fireUp(arrayOfFunction, args) {
    if (arrayOfFunction.length) {
      arrayOfFunction.forEach((x) => {
        if (x && x.func && typeof x.func === 'function') x.func.apply(x.context || this, args);

        if (x && typeof x === 'function') x.apply(this, args);
      });
    }
  }

  /**
   * Is the given parameter an array
   */
  static isAnArray(v) {
    return Utils.isAJSON(v) && v instanceof Array;
  }

  /**
   * Check if we got a version in a String
   * @param {Object} v
   * @return {Boolean}
   */
  static isAVersion(v) {
    if (!v) return false;
    const regexp = /^(\d+(\.\d+)*)$/;

    return regexp.test(v);
  }

  /**
   * Check if we got a Boolean
   * @param {Object} v
   * @return {Boolean}
   */
  static isABoolean(v) {
    return typeof v === 'boolean' || v === 'true' || v === 'false';
  }

  /**
   * Check if we got a Boolean (permissive with true and false strings)
   * @param {Object} v
   * @return {Boolean}
   */
  static isABooleanPermissive(v) {
    return Utils.isABoolean(v) || (v === 'true') || (v === 'false');
  }

  /**
   * Check if we got an ID
   * @param {Object} v
   * @return {Boolean}
   */
  static isAnID(v) {
    if (!v || (typeof v !== 'string')) return false;

    return new RegExp(`^[a-f\\d]{${String(CONSTANT.MONGO_DB_ID_LENGTH)}}$`, 'i')
      .test(v);
  }

  /**
   * Check if we got a null value
   *
   * Is considered NULL :
   * - an empty String
   * - the value 0
   * - the boolean false
   * - the null value
   * - undefined
   *
   * @param {Object} v
   * @return {Boolean}
   */
  static isNull(v) {
    return (v === null) || (v === 0) || (v === false) || (v === 'null') || (v === void 0);
  }

  /**
   * Check if we got a String
   * @param {Object} v
   * @return {Boolean}
   */
  static isAString(v) {
    return typeof v === 'string';
  }

  /**
   * Check if we got an unsigned Integer
   * @param {Object} v
   * @return {Boolean}
   */
  static isAnUnsignedInteger(v) {
    if (v === void 0 || v === null || v instanceof Array || (typeof v === 'object' && !(v instanceof Number))) return false;

    if (v instanceof Number && v >= 0) return true;

    const regexp = /^\+?(0|[0-9]\d*)$/;

    return regexp.test(v);
  }

  /**
   * Check if we got a timestamp
   * @param {Object} v
   * @return {Boolean}
   */
  static isATimestamp(v) {
    if (!v) return false;

    if (v instanceof Date) return true;

    if (typeof v !== 'string' && typeof v !== 'number') return false;

    return (new Date(Number(v)))
      .getTime() > 0;
  }

  /**
   * Check if we got an Integer
   * @param {Object} v
   * @return {Boolean}
   */
  static isAnInteger(v) {
    if (v === void 0 ||
      v === null ||
      v instanceof Array ||
      (typeof v === 'object' && !(v instanceof Number))) return false;

    if (v instanceof Number) return true;

    const regexp = /^[+-]?(0|[1-9]\d*)$/;

    return regexp.test(v);
  }

  /**
   * Check if we got a Float
   * @param {Object} v
   * @return {Boolean}
   */
  static isAFloat(v) {
    if (v === void 0 ||
      v === null ||
      v instanceof Array ||
      (typeof v === 'object' && !(v instanceof Number))) return false;

    const regexp = /^[+-]?\d+(\.\d+)?$/;

    return regexp.test(v);
  }

  /**
   * Get the Cpu usage & memory of the current pid
   */
  static getCpuAndMemoryLoad() {
    return new Promise((resolve, reject) => {
      pusage(process.pid, (err, stat) => {
        if (err) return reject(err);

        return resolve(stat);
      });
    });
  }

  /**
   * Check if we got an Integer
   * @param {Object} v
   * @return {Boolean}
   */
  static isAnIPAddress(v) {
    if (!Utils.isAString(v)) return false;

    const regexpIpv4 = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

    const regexpIpv6 = /^::ffff:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

    return regexpIpv4.test(v) || regexpIpv6.test(v);
  }

  /**
   * Do we have a json in parameters?
   *
   * WARNING: JSON.PARSE ACCEPT PLAIN NUMBERS AND NULL AS VALUES
   *
   * @param {Object} v
   * @return {Boolean}
   */
  static isAJSON(v) {
    // handle the null case
    if (v === null || v === false || v === void 0) return false;

    // handle one part of numbers
    if (v instanceof Number) return false;

    if (typeof v === 'object') return true;

    if (!Utils.isAString(v)) return false;

    // Test a json contains {} or [] data in it
    const regexpJson = /(({*})|(\[*\]))+/;

    if (!regexpJson.test(v)) return false;

    try {
      JSON.parse(v);

      // handle the numbers
      if (Utils.isAnInteger(v) || Utils.isAFloat(v)) return false;

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Transform v into a boolean - (this function is usefull for console commands)
   * @param {Object} v
   * @return {Boolean}
   */
  static toBoolean(v) {
    if (typeof v === 'boolean') return v;

    if (v === 'false') return false;

    if (v === 'true') return true;

    return !!v;
  }
}
