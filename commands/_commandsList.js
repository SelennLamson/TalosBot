var classes = [];

// List all command files here
classes.push(require('./chanban.js'));
classes.push(require('./count.js'));
classes.push(require('./debat.js'));
classes.push(require('./help.js'));
classes.push(require('./ping.js'));
classes.push(require('./purge.js'));
classes.push(require('./salon.js'));
classes.push(require('./say.js'));
classes.push(require('./stats.js'));
classes.push(require('./test.js'));

var cmdList = [];
classes.forEach(c => cmdList.push(new c()));
module.exports.list = cmdList;