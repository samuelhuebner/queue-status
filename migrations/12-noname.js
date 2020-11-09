
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "contactId" to table "callDestination"
 *
 **/

const info = {
    "revision": 12,
    "name": "noname",
    "created": "2020-11-09T13:49:24.641Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "callDestination",
        "contactId",
        {
            "type": Sequelize.INTEGER.UNSIGNED,
            "field": "contactId",
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
