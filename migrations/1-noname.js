
/* eslint-disable */
'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "callDestination", deps: []
 * createTable "callInitiation", deps: []
 * createTable "callPickup", deps: []
 * createTable "caller", deps: []
 * createTable "keyEndedReason", deps: []
 * createTable "queue", deps: []
 * createTable "users", deps: []
 * createTable "callEnding", deps: [keyEndedReason]
 * createTable "callRinging", deps: [callDestination]
 * createTable "callTransfer", deps: [callDestination]
 * createTable "call", deps: [callEnding, callInitiation, callPickup, callRinging, callTransfer, caller]
 *
 **/

const info = {
    "revision": 1,
    "name": "noname",
    "created": "2020-10-05T09:20:33.340Z",
    "comment": ""
};

const migrationCommands = [{
        fn: "createTable",
        params: [
            "callDestination",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "accountNumber": {
                    "type": Sequelize.SMALLINT(3).UNSIGNED,
                    "field": "accountNumber"
                },
                "userName": {
                    "type": Sequelize.STRING,
                    "field": "userName"
                },
                "number": {
                    "type": Sequelize.STRING(30),
                    "field": "number"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "callInitiation",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "callId": {
                    "type": Sequelize.STRING,
                    "field": "callId",
                    "allowNull": false
                },
                "callInitiationTime": {
                    "type": Sequelize.DATE,
                    "field": "callInitiationTime",
                    "defaultValue": Sequelize.Literal,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "callPickup",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "callId": {
                    "type": Sequelize.STRING,
                    "field": "callId",
                    "allowNull": false
                },
                "callPickupTime": {
                    "type": Sequelize.DATE,
                    "field": "callPickupTime",
                    "defaultValue": Sequelize.Literal,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "caller",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "phoneNumber": {
                    "type": Sequelize.STRING(30),
                    "field": "phoneNumber",
                    "allowNull": true
                },
                "contact_id": {
                    "type": Sequelize.INTEGER,
                    "field": "contact_id",
                    "allowNull": true
                },
                "firstContactDate": {
                    "type": Sequelize.DATE,
                    "field": "firstContactDate",
                    "defaultValue": Sequelize.Literal,
                    "allowNull": false
                },
                "lastContactDate": {
                    "type": Sequelize.DATE,
                    "field": "lastContactDate",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "keyEndedReason",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "reason": {
                    "type": Sequelize.STRING,
                    "field": "reason",
                    "allowNull": false
                },
                "successful": {
                    "type": Sequelize.TINYINT(1),
                    "field": "successful",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "queue",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "queueName": {
                    "type": Sequelize.STRING,
                    "field": "queueName",
                    "allowNull": true
                },
                "phoneNumber": {
                    "type": Sequelize.STRING(30),
                    "field": "phoneNumber",
                    "allowNull": false
                },
                "callsWaiting": {
                    "type": Sequelize.SMALLINT,
                    "field": "callsWaiting",
                    "defaultValue": 0,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username",
                    "allowNull": false
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": true
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "callEnding",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "callId": {
                    "type": Sequelize.STRING,
                    "field": "callId",
                    "allowNull": false
                },
                "callEndingTime": {
                    "type": Sequelize.DATE,
                    "field": "callEndingTime",
                    "defaultValue": Sequelize.Literal,
                    "allowNull": false
                },
                "keyEndedReasonId": {
                    "type": Sequelize.INTEGER,
                    "field": "keyEndedReasonId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "keyEndedReason",
                        "key": "id"
                    },
                    "name": "keyEndedReasonId",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "callRinging",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "callId": {
                    "type": Sequelize.STRING,
                    "field": "callId",
                    "allowNull": false
                },
                "callRingingTime": {
                    "type": Sequelize.DATE,
                    "field": "callRingingTime",
                    "defaultValue": Sequelize.Literal,
                    "allowNull": false
                },
                "destinationId": {
                    "type": Sequelize.INTEGER,
                    "field": "destinationId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callDestination",
                        "key": "id"
                    },
                    "name": "destinationId",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "callTransfer",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "callId": {
                    "type": Sequelize.STRING,
                    "field": "callId",
                    "allowNull": false
                },
                "callTransferTime": {
                    "type": Sequelize.DATE,
                    "field": "callTransferTime",
                    "defaultValue": Sequelize.Literal,
                    "allowNull": false
                },
                "destinationId": {
                    "type": Sequelize.INTEGER,
                    "field": "destinationId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callDestination",
                        "key": "id"
                    },
                    "name": "destinationId",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "call",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "callId": {
                    "type": Sequelize.STRING,
                    "field": "callId",
                    "allowNull": false
                },
                "wasSuccessful": {
                    "type": Sequelize.TINYINT(1),
                    "field": "wasSuccessful",
                    "defaultValue": 0,
                    "allowNull": false
                },
                "calledNumber": {
                    "type": Sequelize.STRING(30),
                    "field": "calledNumber",
                    "allowNull": false
                },
                "callEndingId": {
                    "type": Sequelize.INTEGER,
                    "name": "callEndingId",
                    "field": "callEndingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callEnding",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "callInitiationId": {
                    "type": Sequelize.INTEGER,
                    "name": "callInitiationId",
                    "field": "callInitiationId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callInitiation",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "callPickupId": {
                    "type": Sequelize.INTEGER,
                    "name": "callPickupId",
                    "field": "callPickupId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callPickup",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "callRingingId": {
                    "type": Sequelize.INTEGER,
                    "name": "callRingingId",
                    "field": "callRingingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callRinging",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "callTransferId": {
                    "type": Sequelize.INTEGER,
                    "name": "callTransferId",
                    "field": "callTransferId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "callTransfer",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "callerId": {
                    "type": Sequelize.INTEGER,
                    "field": "callerId",
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "caller",
                        "key": "id"
                    },
                    "name": "callerId",
                    "allowNull": false
                }
            },
            {}
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
