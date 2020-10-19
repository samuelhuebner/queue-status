
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "accountNumber" to table "caller"
 *
 **/

const info = {
    "revision": 9,
    "name": "noname",
    "created": "2020-10-19T14:40:07.731Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "caller",
        "accountNumber",
        {
            "type": Sequelize.STRING(10),
            "field": "accountNumber"
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
