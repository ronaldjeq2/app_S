const oracledb = require("oracledb");
const Hoek = require("hoek");

const internals = {
  pool: null
};

exports.attachConnection = async (request, h) => {
  await internals.pool.getConnection().then(connection => {
    request.app.db = connection;
  });
  return h.continue;
};

exports.detachConnection = async (request, h) => {
  if (request.app.db) {
    await request.app.db.close({ drop: false }, function onRelease(err) {
      request.app.db = null;
      if (err) {
        console.log("=== error: detachConnection ===");
        console.log(err);
        console.log("=== /error: detachConnection ===");
      }
    });
  } else {
    if (typeof h !== "undefined") {
      return h.continue;
    }
  }
};

exports.stopConnection = async () => {
  console.log("Connection to the Oracle database closed successfully");
  // https://oracle.github.io/node-oracledb/doc/api.html#-621-poolclose
  await internals.pool.close(
    5, //The number of seconds before the pool and connections are force closed.
    function onStopConnection(err) {
      if (err) {
        console.log("=== error: stopConnection ===");
        console.log(err);
        console.log("=== /error: stopConnection ===");
      }
    }
  );
};

exports.connectStart = () => {
  console.log("Connecting to the Oracle database.... Please Wait.");

  return oracledb
    .createPool({
      connectString: process.env.ORACLE_DB_CONN,
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_PWD,
      poolIncrement: 1, // only grow the pool by one connection at a time
      poolMax: 10, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
      poolMin: 1, // start with no connections; let the pool shrink completely
      poolPingInterval: 15, // check aliveness of connection if idle in the pool for 60 seconds
      poolTimeout: 20 // terminate connections that are idle in the pool for 60 seconds
    })
    .then(function(pool) {
      internals.pool = pool;
      return internals.pool.getConnection((err, connection) => {
        console.log("Connection to the Oracle database successful");
        connection.release();
      });
    })
    .catch(function(err) {
      console.log("e", err);
      console.error("createPool() error: " + err.message);
    });
};
