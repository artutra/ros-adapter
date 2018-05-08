var Realm = require('realm');
var REALM_OBJECT_SERVER_URL = process.env.ROS_URL ? process.env.ROS_URL : 'realm://localhost:9080'
var ADMIN_TOKEN = process.env.ADMIN_TOKEN
var FEATURE_TOKEN = process.env.FEATURE_TOKEN

// Unlock Professional Edition APIs
Realm.Sync.setFeatureToken(FEATURE_TOKEN);

var adapterConfig = {
  // Insert the Realm admin token here
  admin_token: ADMIN_TOKEN,

  // the URL to the Realm Object Server
  server_url: REALM_OBJECT_SERVER_URL,

  // local path for the Adapter API file
  local_path: './adapter',

  // regular expression to limit which Realms will be observed
  realm_path_regex: '/^\/([0-9a-f]+)\/private$/'
};

class CustomAdapter {
  constructor(config) {
    this.adapter = new Realm.Sync.Adapter(
      config.local_path,
      config.server_url,
      Realm.Sync.User.adminUser(config.admin_token, config.server_url),
      config.realm_path_regex,

      // This callback is called any time a new transaction is available for
      // processing for the given path. The argument is the path to the Realm
      // for which changes are available. This will be called for all Realms
      // which match realm_path_regex.
      (realm_path) => {
        var current_instructions = this.adapter.current(realm_path);
        while (current_instructions) {
          // if defined, process the current array of instructions
          this.process_instructions(current_instructions);

          // call advance to progress to the next transaction
          this.adapter.advance(realm_path);
          current_instructions = this.adapter.current(realm_path);
        }
      }
    )
  }

  // This method is passed the list of instructions returned from
  // Adapter.current(path)
  process_instructions(instructions) {
    instructions.forEach((instruction) => {
        // perform an operation for each type of instruction
        switch (instruction.type) {
          case 'INSERT':
            insert_object(instruction.object_type, instruction.identity, instruction.values);
            break;
          case 'DELETE':
            delete_object(instruction.object_type, instruction.identity);
            break;
          // ... add handlers for all other relevant instruction types
          default:
            break;
        }
      })
  }
}

new CustomAdapter(adapterConfig);