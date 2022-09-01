var Framework = require('webex-node-bot-framework');

// No express server needed when running in websocket mode

// framework options
var config = {
  // No webhookUrl, webhookSecret, or port needed
  token: 'Mjc2Y2FiMmYtZmFhOS00ZGY0LWEyNjAtYjA5YjJjZTA0MWQ4ZDMyZGI3YTgtZDYz_P0A1_935f4b77-0a1c-4d96-bc39-d07643ef6a87'
};

// init framework
var framework = new Framework(config);
framework.start();

// An initialized event means your webhooks are all registered and the
// framework has created a bot object for all the spaces your bot is in
framework.on("initialized", function () {
  framework.debug("Framework initialized successfully! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// You can use the bot object to send messages to that space
// The id field is the id of the framework
// If addedBy is set, it means that a user has added your bot to a new space
// Otherwise, this bot was in the space before this server instance started
framework.on('spawn', function (bot, id, addedBy) {
  if (!addedBy) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    framework.debug(`Framework created an object for an existing bot in a space called: ${bot.room.title}`);
  } else {
    // addedBy is the ID of the user who just added our bot to a new space,
    // Say hello, and tell users what you do!
    bot.say('Hi there, you can say hello to me.  Don\'t forget you need to mention me in a group space!');
  }
});


var responded = false;
// say hello
framework.hears('hello', function(bot, trigger) {
  bot.say('Hello %s!', trigger.person.displayName);
  responded = true;
});

// Its a good practice to handle unexpected input
framework.hears(/.*/, function(bot, trigger) {
  if (!responded) {
    bot.say('Sorry, I don\'t know how to respond to "%s"', trigger.message.text);
  }
  responded = false;
});

// gracefully shutdown (ctrl-c)
// This is especially important when using websockets
// as it cleans up the socket connection. Failure to do
// this could result in an "excessive device registrations"
// error during the iterative development process
process.on('SIGINT', function() {
  framework.debug('stoppping...');
  framework.stop().then(function() {
    server.close();
    process.exit();
  });
});