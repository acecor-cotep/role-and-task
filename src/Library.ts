import AMaster from './RoleSystem/Role/RoleMaster/AMaster.js';
import ASlave from './RoleSystem/Role/RoleSlave/ASlave.js';
import Master from './RoleSystem/Role/RoleMaster/Master.js';
import Slave from './RoleSystem/Role/RoleSlave/Slave.js';
import ARole from './RoleSystem/Role/ARole.js';
import RoleAndTask from './RoleAndTask.js';
import ATask from './RoleSystem/Tasks/ATask.js';
import ALink from './RoleSystem/Links/ALink.js';
import AHandler from './RoleSystem/Handlers/AHandler.js';
import RoleHandler from './RoleSystem/Handlers/RoleHandler.js';
import TaskHandler from './RoleSystem/Handlers/TaskHandler.js';
import ZeroMQClientDealer from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js';
import ZeroMQClientPush from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientPush.js';
import ZeroMQServerRouter from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js';
import ZeroMQServerPull from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerPull.js';
import CONSTANT from './Utils/CONSTANT/CONSTANT.js';
import Utils from './Utils/Utils';

/**
 * This is what the library user is going to see
 */
export default {
  ASlave,
  Slave,
  Master,
  AMaster,
  ARole,
  ATask,
  ALink,
  AHandler,
  TaskHandler,
  RoleHandler,
  RoleAndTask,
  ZeroMQClientDealer,
  ZeroMQServerRouter,
  ZeroMQClientPush,
  ZeroMQServerPull,
  CONSTANT,
  parseEqualsArrayOptions: Utils.parseEqualsArrayOptions,
  extractOptionsFromCommandLineArgs: Utils.extractOptionsFromCommandLineArgs,
};
