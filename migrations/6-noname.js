
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "callDirection" to table "call"
 *
 **/

const info = {
    "revision": 6,
    "name": "noname",
    "created": "2020-10-15T19:07:48.775Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "call",
        "callDirection",
        {
            "type": Sequelize.STRING,
            "field": "callDirection",
            "allowNull": true
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize) {
        let index = this.pos;
        return new Promise((resolve, reject) => {
            function next() {
                if (index < migrationCommands.length) {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else {
                    resolve();
                }
            }
            next();
        });
    },
    info
};
