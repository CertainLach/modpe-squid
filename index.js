module.exports = init;

var dir = require("node-dir");

function requireFromString(src, filename) {
    var Module = module.constructor;
    var m = new Module();
    m._compile(src, filename);
    return m.exports;
}

function init(squid) {
    return inject;
}

function log(msg) {
    console.log("[MODPE-NOINJECT] " + msg);
}
        
function modpeApi(){
    
        function initSquid(pl1,srv) {
            player=pl1;
            server=srv;
        }
        
        function clientMessage(message) {
            console.log(message);
            player.chat(message);
        }

        function setTile(x, y, z, id, damage) {
            serv.setBlock(new vec3(x, y, z), id);
        }

        function getTile(x, y, z) {
            serv.world.getBlockType(new vec3(x, y, z));
        }

        function preventDefault() {
            console.log("preventDefault(): WIP");
        }

        function getPlayerX() {
            return player.entity.position.x;
        }

        function getPlayerY() {
            return player.entity.position.y;
        }

        function getPlayerZ() {
            return player.entity.position.z;
        }

        function getPlayerEnt() {
            //console.log("getPlayerEnt(): WIP");
            return null;
        }

        function getCarriedItem() {
            //console.log("getCarriedItem(): WIP");
            return lastUsedItem;
        }
        
        var Player = {
            getCarriedItem: function () {
                //console.log("Player.getCarriedItem(): WIP");
                return lastUsedItem;
            }
        };
        var Entity = {
            getPitch: function () {
                //console.log("Entity.getPitch(): WIP");
                return 1;
            }
            , getYaw: function () {
                //console.log("Entity.getYaw(): WIP");
                return 1;
            }
        };
        var Level = {
            getGameMode: function () {
                return player.gameMode;
            }
            , getData: function (x, y, z) {
                //console.log("Level.getData(): WIP");
                return 0;
            }
        };
}

function convert(code) {
    log("Started conversion...");
    if (code.indexOf(/newlevel/ig)) {
        log("Has newLevel, adding export...");
        code = "var serv=null;\nvar player=null;\nmodule.exports.newLevel=newLevel;\nmodule.exports.initSquid=initSquid;\n" + code;
    }
    api=modpeApi.toString().split("\n");
    api[0]="";
    api[api.length-1]="";
    finapi=api.join("\n");
    code = finapi + code;
    log(code);
    return code;
}

function inject(serv) {
    function log(msg) {
        serv.log("[ModPE-API] " + msg);
    }
    var mods = [];
    log("Injected into server");
    modPePluginsDir = require('path')
        .dirname(require.main.filename) + "/modpePlugins";
    log("Will find modpe scripts in " + modPePluginsDir);
    modCount = 0;
    dir.readFiles(modPePluginsDir, {
            match: /.js$/
            , exclude: /^\./
        }, function (err, content, fname, next) {
            if (err) throw err;
            log("Removing converted modfile: " + fname);
            fs.unlinkSync(fname)
            next();
        }
        , function (err, files) {
            if (err) throw err;
            log("Converted scripts are removed");
        });
    dir.readFiles(modPePluginsDir, {
            match: /.modpe$/
            , exclude: /^\./
        }, function (err, content, fname, next) {
            if (err) throw err;
            log("Converting " + fname);
            content = convert(content);
            modname = fname.split("/")[fname.split("/")
                .length - 1].split(".")[0];
            log("Loading mod " + modname);
            mods.push(requireFromString(content));
            modCount++;
            next();
        }
        , function (err, files) {
            if (err) throw err;
            log('Loaded ' + modCount + " mods");
        });

    serv.on("newPlayer", function (player) {
        injectPlayer(serv, player);
    });

    function injectPlayer(serv, player) {
        log("Injected into player");
        
        initSquid(player,serv);
        newLevel();
        
        function newLevel() {
            log(mods);
            mods.forEach(function (element, index, array) {
                element.newLevel();
            });
        }
        function initSquid(pl,sr) {
            log(pl);
            log(sr);
            mods.forEach(function (element, index, array) {
                element.initSquid(pl,sr);
            });
        }
    }
}