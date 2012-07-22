var spawn = require('child_process').spawn;
var path = require('path');
var bolt = require('usain');

this.server = function() {
	process.env.DEVELOPMENT = 1;
	return bolt.captureOutput("Server", spawn("node", ["server.js"]));
};
this.tests = function() {
	var jasmineScript = path.join("node_modules", "jasmine-node", "bin", "jasmine-node");
	var specsFolder = path.join("app", "server", "specs");
	return bolt.captureOutput("Tests", spawn("node", [jasmineScript, specsFolder]));
};
this.default = function() {
	bolt.task.tests().then(function() {
		bolt.task.server();
	});
};