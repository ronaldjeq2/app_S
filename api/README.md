## API SERVER FOR SENATI MOBILE APP

### This is a Hapi server, backed by MongoDb & Redis

Oline API documentation can be accessed through /documentation thanks to hapi-swagger package

# Content

- [Technologies](#technologies)
  - [Hapi](#Hapi)
  - [OracleDB](#OracleDB)


## Technologies
*The following are brief descriptions of the technologies used*

### [Hapi](http://hapijs.com/)

The nodeJS server uses Hapi. Hapi was developed and Open Sourced by Walmart Labs. It has been battle tested by Walmart, the largest retailer on earth.

#### What is Hapi? http://hapijs.com/

Hapi is *the* framework for rapidly building RESTful & Real-Time web applications and services with Node.js. <br />
Whether you are building a very simple API
for your website/mobile app or a large scale, cache heavy,
secure e-commerce website, hapi has you covered.
Hapi will help get your server developed quickly with its wide range
of configurable options.

#### Key Benefits

- ***Performance*** - WalmartLabs are the guys who found/solved the
[Node.js *CORE* Memory Leak](http://www.joyent.com/blog/walmart-node-js-memory-leak);
they have developed Hapi following
[Benchmark Driven Development](https://github.com/felixge/faster-than-c)
and the result is a high-performance framework
+ ***Security*** - The *Lead* Developer of Hapi is [**Eran Hammer**](https://github.com/hueniverse) who was one of the original authors
of the OAuth (Secure Authentication) Spec. He has built a security-focussed
mindset into Hapi and reviews all code included in Hapi. Several members of the [Node Security Project](https://nodesecurity.io) are *core* contributors to
Hapi which means there are many security-minded eyes on the code.
- ***Scalability*** - they have focussed on *horizontal-scalability*
and battle-tested the framework during [Black Friday](http://nodeup.com/fiftysix)
(*holiday shopping busy day*) without incident.
- **Mobile Optimised** (lightweight - built for mobile e-commerce)
- **Plugin Architecture** - extend/add your own modules (good ecosystem)
- ***DevOps Friendly*** - configuration based deployment and great stats/logging see: [#logging with good](https://github.com/dwyl/learn-hapi#logging-with-good) section below!
- Built-in ***Caching*** (Redis, MongoDB or Memcached)
- ***100% Test/Code Coverage*** (for the core) - *disciplined approach to code quality*
+ ***Testability*** - End-to-End testing is ***built-in*** to Hapi because
it *includes* [**shot**](https://github.com/hapijs/shot)
- **Key Functionality** is **Built-in** and there are *many* plugins for other
features: http://hapijs.com/plugins


#### _In-depth Comparison_ to Express.js

@ethanmick wrote a detailed post on why _he_ prefers Hapi to Express:
http://www.ethanmick.com/why-i-like-hapi-more-than-express/ --its worth a read.
[PDF](https://github.com/dwyl/learn-hapi/files/502449/Why-I-like-Hapi-more-than-Express.pdf)

#### _Beginner Friendly_ Examples/Apps to Learn From/With

We have a few "_beginner_" example apps (with documentation & tests!)
that will help you get started with something a bit more "real world":

+ Registration & Login (Basics): https://github.com/dwyl/hapi-login-example-postgres
+ Chat using Hapi, Redis & Socket.io: https://github.com/dwyl/hapi-socketio-redis-chat-example

For a _list_ of examples see: https://github.com/dwyl?&query=example


#### Who (_is using Hapi_) ?

The list of teams using Hapi.js to build their node.js apps grows every day!
See: http://hapijs.com/community

> While you should _not_ make your decisions to use a given technology
based on who _else_ is using it, you should be _aware_ that
and if you need to to answer the **question**:
"***Who is already using this in Production?***"
it's _really_ useful to have a good list.

### [OracleDB](https://github.com/oracle/node-oracledb)

The node-oracledb add-on for Node.js powers high performance Oracle Database applications.
Use node-oracledb to connect Node.js 4, 6 and 7 to Oracle Database.
The add-on is stable, well documented, and has a comprehensive test suite.
The node-oracledb project is open source and maintained by Oracle Corp. The home page is on the Oracle Technology Network.

#### On Windows

Dont forget Install all the required tools and configurations using Microsoft's windows-build-tools using npm install --global --production windows-build-tools from an elevated PowerShell or CMD.exe (run as Administrator) https://github.com/nodejs/node-gyp

#### On Ubuntu [oficial documentation](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#-3-node-oracledb-installation-on-linux-with-instant-client-zip-files)

##### Install the free Oracle Instant Client 'Basic' and 'SDK' ZIPs

Download the free **Basic** and **SDK** ZIPs from
[Oracle Technology Network](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html)
and
[install them](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html#ic_x64_inst)
into the same directory:

```
cd /opt/oracle
unzip instantclient-basic-linux.x64-12.2.0.1.0.zip
unzip instantclient-sdk-linux.x64-12.2.0.1.0.zip
mv instantclient_12_2 instantclient
cd instantclient
ln -s libclntsh.so.12.1 libclntsh.so
```

You will need `libaio` installed.  On some platforms the package is
called `libaio1`.

To run applications, you will need to set the link path:

```
export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
```

Alternatively, if there is no other Oracle software on the machine
that will be impacted, permanently add Instant Client to the run-time
link path.  Do this on Linux by creating a file
`/etc/ld.so.conf.d/oracle-instantclient.conf` that contains the library
location `/opt/oracle/instantclient`, and then run `ldconfig` as
the root user.

##### Install the add-on

Tell the installer where to find Instant Client:

```
export OCI_LIB_DIR=/opt/oracle/instantclient
export OCI_INC_DIR=/opt/oracle/instantclient/sdk/include
```

Use absolute paths for the variable values.  These variables are only
needed during installation.

If Instant Client is in the default location
`/opt/oracle/instantclient` and you have no other Oracle software
installed, then these variables are not actually required.  See
[Oracle Client Location Heuristic on Linux](#linuxinstsearchpath).

If you are behind a firewall you may need to set your proxy, for
example:

```
export http_proxy=http://my-proxy.example.com:80/
```

Install node-oracledb from the
[NPM registry](https://www.npmjs.com/package/oracledb):

```
npm install oracledb
```

If you are installing with `sudo`, you may need to use `sudo -E` to
preserve the environment variable values.

