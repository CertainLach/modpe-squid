module.exports = init;

var vec3 = require("vec3");
var dir = require("node-dir");
var fs = require("fs");

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

function modpeApi() {
    function euclideanMod(numerator, denominator) {
        var result = numerator % denominator;
        return result < 0 ? result + denominator : result;
    }

    function Vec3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vec3.prototype.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };

    Vec3.prototype.update = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    };

    Vec3.prototype.floored = function () {
        return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    };

    Vec3.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    };

    Vec3.prototype.offset = function (dx, dy, dz) {
        return new Vec3(this.x + dx, this.y + dy, this.z + dz);
    };
    Vec3.prototype.translate = function (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
        return this;
    };
    Vec3.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    };
    Vec3.prototype.subtract = function (other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    };
    Vec3.prototype.plus = function (other) {
        return this.offset(other.x, other.y, other.z);
    };
    Vec3.prototype.minus = function (other) {
        return this.offset(-other.x, -other.y, -other.z);
    };
    Vec3.prototype.scaled = function (scalar) {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    };
    Vec3.prototype.abs = function () {
        return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    };
    Vec3.prototype.volume = function () {
        return this.x * this.y * this.z;
    };
    Vec3.prototype.modulus = function (other) {
        return new Vec3(
            euclideanMod(this.x, other.x)
            , euclideanMod(this.y, other.y)
            , euclideanMod(this.z, other.z));
    };
    Vec3.prototype.distanceTo = function (other) {
        var dx = other.x - this.x;
        var dy = other.y - this.y;
        var dz = other.z - this.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };
    Vec3.prototype.equals = function (other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    };
    Vec3.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    };
    Vec3.prototype.clone = function () {
        return this.offset(0, 0, 0);
    };
    Vec3.prototype.min = function (other) {
        return new Vec3(Math.min(this.x, other.x), Math.min(this.y, other.y), Math.min(this.z, other.z));
    };
    Vec3.prototype.max = function (other) {
        return new Vec3(Math.max(this.x, other.x), Math.max(this.y, other.y), Math.max(this.z, other.z));
    };
    vec3 = Vec3;

    var serv = null;
    var player = null;
    var lastUsedItem = -1;

    module.exports.startDestroyBlock = startDestroyBlock;
    module.exports.destroyBlock = destroyBlock;
    module.exports.newLevel = newLevel;
    module.exports.procCmd = procCmd;
    module.exports.exec = exec;
    module.exports.modTick = modTick;
    module.exports.useItem = useItem;
    module.exports.initSquid = initSquid;

    function initSquid(pl1, srv) {
        player = pl1;
        server = srv;
    }

    function clientMessage(message) {
        console.log(message);
        player.chat(message);
    }

    function setTile(x, y, z, id, damage) {
        server.setBlock(new vec3(x, y, z), id);
    }

    function getTile(x, y, z) {
        server.world.getBlockType(new vec3(x, y, z));
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

    code = "function modTick(){}\n" + code;
    code = "function newLevel(){}\n" + code;
    code = "function useItem(x,y,z,itemId,blockId){}\n" + code;
    code = "function startDestroyBlock(x,y,z,side){}\n" + code;
    code = "function destroyBlock(x,y,z,side){}\n" + code;
    code = "function procCmd(command){}\n" + code;
    code = "function exec(code){eval(code)}\n" + code;

    api = modpeApi.toString()
        .split("\n");
    api[0] = "";
    api[api.length - 1] = "";
    finapi = api.join("\n");
    code = finapi + code;
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
    try {
        fs.mkdirSync(modPePluginsDir);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
    log("Place your scripts in " + modPePluginsDir);
    modCount = 0;
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
            log('Loaded ' + modCount + " mods");
        });

    serv.on("newPlayer", function (player) {
        injectPlayer(serv, player);
    });

    function injectPlayer(serv, player) {
        log("Injected into player");

        initSquid(player, serv);
        newLevel();

        player._client.on("block_dig", function (packet) {
            var pos = new vec3(packet.location);
            currentlyDugBlock = serv.world.getBlock(pos);
            if (packet.status == 0 && player.gameMode != 1)
                startDestroyBlock(pos.x, pos.y, pos.z, 0);
            else if (packet.status == 2)
                destroyBlock(pos.x, pos.y, pos.z, 0);
            else if (packet.status == 1)
                console.log("Unused in ModPE");
            else if (packet.status == 0 && player.gameMode == 1)
                destroyBlock(pos.x, pos.y, pos.z, 0);
        });

        player._client.on('position', function (packet) {
            modTick();
        });

        player._client.on("block_place", function (packet) {
            if (packet.location.y < 0) return;
            useItem(packet.location.x, packet.location.y, packet.location.z, packet.heldItem.blockId, serv.world.getBlockType(new vec3(packet.location.x, packet.location.y, packet.location.z)));
        });

        function handleCommand(command) {
            procCmd(command);
        }
        player.handleCommand = handleCommand;

        function newLevel() {
            mods.forEach(function (element, index, array) {
                element.newLevel();
            });
        }

        function useItem(x, y, z, itemId, blockId) {
            mods.forEach(function (element, index, array) {
                element.useItem(x, y, z, itemId, blockId);
                element.exec("lastUsedItem=" + itemId);
            });
        }

        function modTick() {
            mods.forEach(function (element, index, array) {
                element.modTick();
            });
        }

        function exec(code) {
            mods.forEach(function (element, index, array) {
                element.exec(code);
            });
        }

        function procCmd(command) {
            mods.forEach(function (element, index, array) {
                element.procCmd(command);
            });
        }

        function startDestroyBlock(x, y, z, side) {
            mods.forEach(function (element, index, array) {
                element.startDestroyBlock(x, y, z, side);
            });
        }

        function destroyBlock(x, y, z, side) {
            mods.forEach(function (element, index, array) {
                element.destroyBlock(x, y, z, side);
            });
        }

        function initSquid(pl, sr) {
            mods.forEach(function (element, index, array) {
                element.initSquid(pl, sr);
            });
        }
    }
}