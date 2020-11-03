
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "contact_id" from table "caller"
 * addColumn "contactId" to table "caller"
 *
 **/

const info = {
    "revision": 11,
    "name": "noname",
    "created": "2020-10-30T14:44:18.253Z",
    "comment": ""
};

const migrationCommands = [{
        fn: "removeColumn",
        params: ["caller", "contact_id"]
    },
    {
        fn: "addColumn",
        params: [
            "caller",
            "contactId",
            {
                "type": Sequelize.INTEGER,
                "field": "contactId",
                "allowNull": true
            }
        ]
    }
];

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
