var liveServer = require("live-server");
// const chalkAnimation = require('chalk-animation');

var params = {
  root: "build/", // Set root directory that's being served. Defaults to cwd.
  open: false, // When false, it won't load your browser by default.
  ignore: '**/*tmp-browserify*', // comma-separated string for paths to ignore
  wait: 0, // Waits for all changes, before reloading. Defaults to 0 sec.
  mount: [['/', './build']], // Mount a directory to a route.
  logLevel: 1, // 0 = errors only, 1 = some, 2 = lots,
  watch: "build/",
};

// liveServer.start(params);


const lsPromise = liveServer.start(params);

lsPromise.addListener('listening', function(/*e*/) {
  var address = lsPromise.address();
  var serveHost = address.address === "0.0.0.0" ? "127.0.0.1" : address.address;
  var serveURL = 'http' + '://' + serveHost + ':' + address.port;

  console.log('\n-----------');
  console.log(serveURL);
  console.log('-----------\n'); // Animation starts
});

