//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class contain utilitaries functions for devs
 */

// Includes
import colors from 'colors';
import Utils from './Utils.js';
import Core from '../Core/Core.js';

let instance = null;

/**
 * Contain utilitaries functions
 */
export default class DevUtils {
  /**
   * constructor
   */
  constructor() {
    if (instance) return instance;

    instance = this;

    return instance;
  }

  /**
   * Singleton Implementation
   */
  static getInstance() {
    return instance || new DevUtils();
  }

  /**
   * Get a Line
   */
  static get LINE() {
    return '\n>------------------------------------------\n';
  }

  /**
   * Display some JSON using json.stringify
   * It's a simple shortcut
   * @param {Object} x
   */
  static djson(x) {
    const strsParts = [];

    const displayIndent = (level) => {
      for (let i = 0; i < level; i += 1) strsParts.push('    ');
    };

    const displayOneLevel = (ptr, indent = 0, parentIsKey = false) => {
      // We have an array
      if (ptr && ptr instanceof Array) {
        if (!parentIsKey) displayIndent(indent);

        strsParts.push('[\n'.white);

        ptr.forEach(y => displayOneLevel(y, indent + 1));

        displayIndent(indent);

        strsParts.push('],\n'.white);

        return;
      }

      // We have a json
      if (Utils.isAJSON(ptr) && !Utils.isAMongooseObjectId(ptr) && !(ptr instanceof Date)) {
        if (!parentIsKey) displayIndent(indent);

        strsParts.push('{\n'.white);

        Object.keys(ptr)
          .forEach((y) => {
            displayIndent(indent + 1);

            strsParts.push(`${y}: `.green);

            displayOneLevel(ptr[y], indent + 1, true);
          });

        displayIndent(indent);

        if (indent) strsParts.push('},\n'.white);
        else strsParts.push('}\n'.white);

        return;
      }

      const getTextDueToDataType = () => {
        const str = `${ptr},\n`;

        const commaJump = ',\n'.white;

        let toRet = str;

        // If we have a string do something
        const conf = [{
          check: v => v instanceof Date,

          do: () => {
            try {
              return `${colors.magenta.bold('\'')}${colors.yellow(ptr.toISOString())}${colors.magenta.bold('\'')}${commaJump}`;
            } catch (e) {
              // Handle the range error
              return `${colors.magenta.bold('\'')}${colors.yellow(ptr)}${colors.magenta.bold('\'')}${commaJump}`;
            }
          },
        }, {
          check: Utils.isAMongooseObjectId,

          do: () => `${colors.magenta.bold('\'')}${colors.yellow(String(ptr))}${colors.magenta.bold('\'')}${commaJump}`,
        }, {
          check: Utils.isAnID,

          do: () => `${colors.magenta.bold('\'')}${colors.yellow(ptr)}${colors.magenta.bold('\'')}${commaJump}`,
        }, {
          check: Utils.isAnInteger,

          do: () => `${colors.cyan.bold(ptr)}${commaJump}`,
        }, {
          check: Utils.isAnUnsignedInteger,

          do: () => `${colors.cyan.bold(ptr)}${commaJump}`,
        }, {
          check: Utils.isAFloat,

          do: () => `${colors.cyan.bold.underline(ptr)}${commaJump}`,
        }, {
          check: Utils.isABoolean,

          do: () => `${ptr ? colors.bgGreen.white(ptr) : colors.bgRed.white(ptr)}${commaJump}`,
        }, {
          check: Utils.isNull,

          do: () => `${colors.bgRed.white.bold.underline(ptr)}${commaJump}`,
        }, {
          check: Utils.isAVersion,

          do: () => `${colors.bgMagenta.bold('\'')}${colors.bgMagenta.white(ptr)}${colors.bgMagenta.bold('\'')}${commaJump}`,
        }, {
          check: Utils.isAString,

          do: () => `${colors.magenta.bold('\'')}${colors.magenta.bold(ptr)}${colors.magenta.bold('\'')}${commaJump}`,
        }];

        conf.some((y) => {
          if (y.check(ptr)) {
            toRet = y.do();

            return true;
          }

          return false;
        });

        return toRet;
      };

      // We have something else
      if (!parentIsKey) displayIndent(indent);
      strsParts.push(getTextDueToDataType());
    };

    displayOneLevel(x);

    Core.getInstance()
      .displayMessage({
        str: Utils.monoline(strsParts),
      });
  }

  /**
   * Display something
   * It's a simple shortcut
   * @param {Object} x
   */
  static d(x) {
    Core.getInstance()
      .displayMessage({
        str: `${x}`.red,
      });
  }

  /**
   * Display an Error
   * It's a simple shortcut
   * @param {Object} x
   */
  static dre(x) {
    Core.getInstance()
      .displayMessage({
        str: String(x)
          .bgRed.bold.white,
      });
  }

  /**
   * Smart display
   * You gives something in enter and display it (Json or other)
   * @param {Object} x
   */
  static sd(x) {
    if (x instanceof Error) DevUtils.dre(x);
    else if (Utils.isAJSON(x)) DevUtils.djson(x);
    else DevUtils.d(x);
  }
}

// export the var to other files using GLOBAL variable
global.DEV = DevUtils;
