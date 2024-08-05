/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
'use strict';

const oracledb = require('oracledb');

let internals = {};

const fetchDbmsOutputLine = function (conn, query, output, cb) {
  // console.log(`<<<< ${output.count} >>>>`)
  if (output.count == 0){
    conn.execute("begin dbms_output.enable(null); end;", function(err,result){
      // console.log('<<<<<< dbms_output.enable >>>>>')
      // console.log(err)
      // console.log(result)
    })
    conn.execute( ...query , function(err,result){
      // console.log('<<<<< query >>>>>')
      // console.log(err)
      // console.log(result)
    })
  }

  conn.execute(
    "BEGIN DBMS_OUTPUT.GET_LINE(:ln, :st); END;",
    { ln: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
      st: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
    function(err, result) {
      // console.log(result)
      if (err) {       
        return cb(err, conn);
      } else if (result.outBinds.st == 1) { 
        // no more output
        try {
          output.json = JSON.parse("[" + output.lines.join(',') + "]");
        } catch(e) {
          console.log(e);
          return cb(err, conn);
        }        
        return cb(null, conn);  
      } else {
        output.lines.push(result.outBinds.ln)
        output.count += 1
        return fetchDbmsOutputLine(conn, query, output, cb);
      }
    });
};

internals.fetchDbmsOutputLine = fetchDbmsOutputLine;

module.exports = internals;