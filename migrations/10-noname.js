
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "isAdmin" to table "users"
 *
 **/

const info = {
    "revision": 10,
    "name": "noname",
    "created": "2020-10-23T16:51:55.247Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "users",
        "isAdmin",
        {
            "type": Sequelize.TINYINT(1),
            "field": "isAdmin",
            "defaultValue": 0,
            "allowNull": false
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
