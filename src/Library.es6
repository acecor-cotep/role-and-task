 import ASlave from './RoleSystem/Role/RoleSlave/ASlave.js';
 import AMaster from './RoleSystem/Role/RoleMaster/AMaster.js';
 import ARole from './RoleSystem/Role/ARole.js';
 import RoleAndTask from './RoleAndTask.js';
 import ATask from './RoleSystem/Tasks/ATask.js';
 import ALink from './RoleSystem/Links/ALink.js';
 import ZeroMQClientDealer from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js';
 import ZeroMQClientPush from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientPush.js';
 import ZeroMQServerRouter from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js';
 import ZeroMQServerPull from './CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerPull.js';
 import CONSTANT from './Utils/CONSTANT/CONSTANT.js';

 /**
  * This is what the library user is going to see
  */
 export default {
   ASlave,
   AMaster,
   ARole,
   ATask,
   ALink,
   RoleAndTask,
   ZeroMQClientDealer,
   ZeroMQServerRouter,
   ZeroMQClientPush,
   ZeroMQServerPull,
   CONSTANT,
 };
