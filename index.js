module.exports=init;

function init(squid) {
    return inject;
}

function inject(serv)
{
    serv.on("newPlayer",function(player){
        injectPlayer(serv,player);
    });
}

function injectPlayer(serv,player)
{

}