const Realm = require('realm');
const fs = require('fs');
const path = require('path');
const PostgresAdapter = require('realm-data-adapters').PostgresAdapter;

var adminJson = require('../keys/admin.json')
var ROS_URL = process.env.ROS_URL ? process.env.ROS_URL : 'localhost'
var ROS_PORT = process.env.ROS_PORT ? process.env.ROS_PORT : '9080'
var FEATURE_TOKEN = process.env.FEATURE_TOKEN
var DATABASE_NAME = 'ros_db'
// Unlock Data Connector APIs
// Realm.Sync.setAccessToken(FEATURE_TOKEN);

console.log(ROS_URL)
const admin_user = Realm.Sync.User.adminUser(adminJson.ADMIN_TOKEN, 'http://'+ROS_URL +':'+ ROS_PORT);

// Print out uncaught exceptions
process.on('uncaughtException', (err) => console.log(err));
setTimeout(()=>{
var adapter = new PostgresAdapter({
    // Realm configuration parameters for connecting to ROS
    realmConfig: {
        server: 'realm://'+ROS_URL+':'+ROS_PORT, // or specify your realm-object-server location
        user:   admin_user,
    },
    dbName: DATABASE_NAME,
    // Postgres configuration and database name
    postgresConfig: {
      host:     'postgres_db', // the host of your PostgreSQL instance
      port:     5432, // the port of your PostgreSQL instance
      user:     'ros_user', // replace with your PostgreSQL instance,
      password: 'ros_example',
    },
    resetPostgresReplicationSlot: true,


    // Set to true to create the Postgres DB if not already created
    createPostgresDB: false,
    initializeRealmFromPostgres: true,
    // Map of custom types to Postgres types
    /*customPostgresTypes: {
        'USER-DEFINED': 'text',
        'ARRAY':        'text',
        'mpaa_rating':  'text',
        'year':         'integer',
    },*/
    // Set to true to indicate Postgres tables should be created and
    // properties added to these tables based on schema additions
    // made in Realm. If set to false any desired changes to the
    // Postgres schema will need to be made external to the adapter.
    applyRealmSchemaChangesToPostgres: false,

    // Only match a single Realm called 'myRealm'
    realmRegex: 'myRealm',

    // Specify the Realm name all Postgres changes should be applied to
    mapPostgresChangeToRealmPath: function(tableName, extraProps) {
        return `${tableName}`; // or some sort of logic
    },
    // Specify the Realm objects we want to replicate in Postgres.
    // Any types or properties not specified here will not be replicated
    schema: [{
        name:       'disciplines',
        primaryKey: 'id',
        properties: {
            id:     { type: 'int' },
            name: { type: 'string', optional: true },
            created_at: { type: 'date', optional: true },
            updated_at: { type: 'date', optional: true },
            deleted_at: { type: 'date', optional: true },
        },
    }],

    printCommandsToConsole: true,
});

}, 10000)