//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/**
 * This class is the main CONSTANT that import all child constant files
 */

// Here are import of every child classes locate din ImportedConstant folder
import Root from './ImportedConstant/Root.js';
import System from './ImportedConstant/System.js';
import ZeroMQ from './ImportedConstant/ZeroMQ.js';

/**
 **  Every child classes must be instenciate like this :
 **  superclass => return class extends superclass {}
 **
 ** @example
 ** Here is an array of classes :
 **   [
 **     A,
 **     B,
 **     C,
 **     ROOT,
 **   ] array
 **
 ** This function will return a class like this :
 ** class CONSTANT extends recursiveInterface(array)
 **
 ** Is equivalent to :
 **
 ** class CONSTANT extends(class A extends (class B extends (class C extends (class ROOT))))
 **
 ** For example if B needs to access C methods, B needs to extends C, B needs to be before C in the array
 **
 */
function recursiveInterface(arr: Array<any>, i: number = 0) {
  if (!arr[i]) {
    return class {};
  }

  return arr[i](recursiveInterface(arr, i + 1));
}

export default class CONSTANT extends recursiveInterface([
  ZeroMQ,
  System,

  // Keep Root at the end, this is the root class for the dependencies
  Root,
]) {}
