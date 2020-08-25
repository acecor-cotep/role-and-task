Welcome to COTEP repositories !

#### Presentation

`@cotep/role-and-task` is a package that is able to start and manage multiple Node.js processes ; assigning specifics tasks to each one of them.

`@cotep/role-and-task` is an easy way to scale your application 100% offline and to get rid of monothread issue.

-----------------------------

#### Role

A role of a processus is either "master" or "slave". There can be only one master, but many slaves.

-----------------------------

#### Task

A task is defined by a singleton class that is designed to do handle one aspect of your program.

Example of tasks :

|Name of the tasks| Description |
|-----------------|------------|
| db-access | Handle the concurrency access to the database, implementing customized lock system  |
| server-api | Web server receiving webservice calls  |
| calcul-api | Execute commands received by server-api task(s)  |
| log | Receive and store logs |
| conversion | Handle picture conversions  |
| calcul-view |  Handle view calculations |
| calcul-view-load-balancer | Orchestrate the calls to calcul-view |

-----------------------------
#### Links

The processes and the tasks are linked with each other using a ZeroMQ pipe which allow them to communicate and perform complex work.

-----------------------------
#### Installation using npm

> npm install --save @cotep/role-and-task

-----------------------------
#### Installation standalone

> clone this repository
> npm i

-----------------------------
#### Run an example

> npm run testSimple

There is an example showing you how to create your tasks and launch several processus using a single configuration file.

-----------------------------
#### Configuration file

The processes and tasks are created following a configuration file at the start of the application. Here is an example about a minimal configuration file, starting 2 extra nodes processes, making them execute the task `simple-task`

```
{
    // Define the master configuration
    master: {
        // Options to launch the master with
        // ipServer/portServer
        options: {},

        // Tasks to launch in master process
        tasks: [{
          id: "simple-task",
          args: {},
        }],
    },

    // Define the Slaves configuration
    // One slave means one process
    slaves: [{
      name: "#2",

      tasks: [{
        id: "simple-task",
        args: {},
      }],
    }, {
      name: "#3",

      tasks: [{
        id: "simple-task",
        args: {},
      }],
    }],

    // Define the connections to makes between the tasks
    task_connect: [],
}
```

----------------------------------

#### Project history

This project has been created in 2016 in pure javascript. Since then it has been brought up-to-date to use `typescript` language ; even thought we spent some time improving the code base, there are still some part of the code that are not 100% clean (any, linting errors ...).

----------------------------------

#### Next features

- Replace ZeroMQ / as of today last version of zeroMq is buggy and the old version that we use start being deprecated (node.js 8 mandatory)
- Dynamic creation of processus / tasks


License
----

MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
