
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "keyAllowedDomain", deps: []
 *
 **/

const info = {
    "revision": 4,
    "name": "noname",
    "created": "2020-10-14T13:27:20.264Z",
    "comment": ""
};

const migrationCommands = [{
    fn: "createTable",
    params: [
        "keyAllowedDomain",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "primaryKey": true,
                "autoIncrement": true
            },
            "domainName": {
                "type": Sequelize.STRING,
                "field": "domainName",
                "allowNull": false
            }
        },
        {}
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
