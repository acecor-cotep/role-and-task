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
declare const _default: {
    ASlave: typeof ASlave;
    Slave: typeof Slave;
    Master: typeof Master;
    AMaster: typeof AMaster;
    ARole: typeof ARole;
    ATask: typeof ATask;
    ALink: typeof ALink;
    AHandler: typeof AHandler;
    TaskHandler: typeof TaskHandler;
    RoleHandler: typeof RoleHandler;
    RoleAndTask: typeof RoleAndTask;
    ZeroMQClientDealer: typeof ZeroMQClientDealer;
    ZeroMQServerRouter: typeof ZeroMQServerRouter;
    ZeroMQClientPush: typeof ZeroMQClientPush;
    ZeroMQServerPull: typeof ZeroMQServerPull;
    CONSTANT: typeof CONSTANT;
};
/**
 * This is what the library user is going to see
 */
export default _default;
