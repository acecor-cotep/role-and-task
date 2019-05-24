//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

/*
 * This class handle errors in the app
 */

// Includes
import ErrorsLibrary from '@cotep/errors';

import RoleAndTask from '../RoleAndTask.js';
import CONSTANT from './CONSTANT/CONSTANT.js';
// ----------------------

// To do once

ErrorsLibrary.declareCodes({
  // Special error that say we just want to add some extra stack trace data (but without using new error code)
  ESTACKTRACE: 'Stack Trace',

  // Default error
  E0000: 'No Specified Error',

  // Unexpected error
  EUNEXPECTED: 'Unexpected Error',

  // Launching error
  INVALID_LAUNCHING_MODE: 'Invalid launching mode',
  INVALID_LAUNCHING_PARAMETER: 'Invalid launching parameters',
  ERROR_CREATING_FILE_API: 'Impossible ti create the api.json file',

  // Slave Error
  SLAVE_ERROR: 'Slave Error',

  // General catch
  GENERAL_CATCH: 'General Catch',

  // MAINTAINANCE
  MAINTAINANCE: 'Program is in maintainance',

  // Server Error
  E2000: 'Cannot start API server',
  E2001: 'Cannot stop API server',
  E2002: 'Unknown API server at the given port',
  E2003: 'Cannot start OBJ server',
  E2004: 'Cannot stop OBJ server',
  E2005: 'ZeroMQ: Cannot connect the server',
  E2006: 'ZeroMQ: Cannot close the socket',
  E2007: 'ZeroMQ: Cannot bind the server',
  E2008: 'ZeroMQ: Bad socketType for the kind of ZeroMQ implementation you choose',
});

/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
export default class Errors extends ErrorsLibrary {
  /**
   * Display the colored error
   * @override
   */
  displayColoredError() {
    RoleAndTask.getInstance()
      .displayMessage({
        str: `${this.getColoredErrorString(true)} - 2`,

        tags: [
          CONSTANT.MESSAGE_DISPLAY_TAGS.ERROR,
        ],
      });
  }

  /**
   * Display the recorded error
   * @override
   */
  displayError() {
    RoleAndTask.getInstance()
      .displayMessage({
        str: `${this.getErrorString()} - 1`.red.bold,
        tags: [
          CONSTANT.MESSAGE_DISPLAY_TAGS.ERROR,
        ],
      });
  }
}
