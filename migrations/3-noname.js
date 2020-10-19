
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "validationToken" to table "users"
 *
 **/

const info = {
    "revision": 3,
    "name": "noname",
    "created": "2020-10-14T09:33:32.000Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "users",
        "validationToken",
        {
            "type": Sequelize.STRING,
            "field": "validationToken",
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
