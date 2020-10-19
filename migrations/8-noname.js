
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "isExternal" to table "callDestination"
 *
 **/

const info = {
    "revision": 8,
    "name": "noname",
    "created": "2020-10-19T13:28:40.991Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "callDestination",
        "isExternal",
        {
            "type": Sequelize.TINYINT(1),
            "field": "isExternal",
            "allowNull": false,
            "defaultValue": 0
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
