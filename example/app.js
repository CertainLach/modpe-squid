var mcServer = require("flying-squid");
//var modpeWrap = require('..')(mcServer);

//var serv = 
console.log(wtf);
mcServer.createMCServer({
  motd: "Basic flying-squid server with ModPE support",
  'max-players': 10,
  port: 252,
  'online-mode': true,
  gameMode:0,
  commands: {},
  logging:true
});

//modpeWrap(serv);