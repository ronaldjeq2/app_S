/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
'use strict';

const db_test = require('../../database/banner_api/db_test');
const oracledb = require('oracledb');
const _ = require('lodash');

const schema = process.env.ORACLE_DB_CONN.search("PROD") > 0 ? "SENATI" : "SENATI";

let internals = {};
/**
 * ## restrictedArea - you can only reach here if you've passed
 * authentication
 *
 * note: the user name is available from the credentials!
 */
internals.questionList = function (request, h) {
    let credentials = request.auth.credentials;
    try {
        return request.app.db
            .execute(
                ...[`
      SELECT sq.question_id, sq.question_text, sa.answer_text 
      FROM ${schema}.APP_SURVEY_QUESTION sq
      LEFT JOIN 
        ${schema}.APP_SURVEY_ANSWER sa
          ON sq.question_id = sa.question_id and sa.user_id = ${credentials.pidm}
      `,
                {},
                { outFormat: oracledb.OBJECT }
                ]
            )
            .then(data => {
                data.rows = _.map(data.rows, (obj) => {
                    if (obj.ANSWER_TEXT === "undefined") {
                        obj.ANSWER_TEXT = "";
                    }
                    if (typeof obj.ANSWER_TEXT === "string") {
                        obj.ANSWER_TEXT = obj.ANSWER_TEXT.trim();
                    }

                    return obj;
                });
                return (data);
            }).catch(error => {
                console.log(error);
                return (error);
            });

    }
    catch (e) {
        console.log(e);
        return e
    }
};

internals.questionSave = function (request, h) {

    let credentials = request.auth.credentials;
    const comment1 = !request.payload.comment1.trim() ? ' ' : request.payload.comment1.trim();
    const comment2 = !request.payload.comment2.trim() ? ' ' : request.payload.comment2.trim();
    try {
        return request.app.db
            .execute(
                ...[`DELETE FROM ${schema}.APP_SURVEY_ANSWER WHERE user_id = ${credentials.pidm}`, {}, { outFormat: oracledb.OBJECT }]
            )
            .then(data => {
                let update;
                update = request.app.db.execute(...[
                    `INSERT ALL 
          INTO ${schema}.APP_SURVEY_ANSWER (user_id, question_id, answer_text) VALUES(${credentials.pidm}, 1, :comment1 )
          INTO ${schema}.APP_SURVEY_ANSWER (user_id, question_id, answer_text) VALUES(${credentials.pidm}, 2, :comment2 )
        SELECT * FROM DUAL`,
                    {
                        comment1: { dir: oracledb.BIND_IN, type: oracledb.STRING, maxSize: 200, val: comment1 },
                        comment2: { dir: oracledb.BIND_IN, type: oracledb.STRING, maxSize: 200, val: comment2 },
                    },
                    { outFormat: oracledb.OBJECT, autoCommit: true }
                ]);

                return update;
            }).
            then(data => {
                return (data);
            }).catch(error => {
                console.log(error);
                return (error);
            });
    }
    catch (e) {
        console.log(e);
        return e
    }
};


module.exports = internals;
