
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "username" on table "users"
 *
 **/

const info = {
    "revision": 5,
    "name": "noname",
    "created": "2020-10-15T10:56:11.046Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "changeColumn",
    params: [
        "users",
        "username",
        {
            "type": Sequelize.STRING,
            "field": "username",
            "unique": true,
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
