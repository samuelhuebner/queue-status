
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "isExternal" to table "caller"
 *
 **/

const info = {
    "revision": 7,
    "name": "noname",
    "created": "2020-10-19T09:34:31.658Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "addColumn",
    params: [
        "caller",
        "isExternal",
        {
            "type": Sequelize.TINYINT(1),
            "field": "isExternal",
            "defaultValue": 1,
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
