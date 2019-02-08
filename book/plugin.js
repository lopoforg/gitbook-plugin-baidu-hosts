require(["gitbook"], function(gitbook) {
    gitbook.events.bind("start", function(e, config) {
        config["baidu-host"] = config["baidu-host"] || {};
        var host = location.host;
        if(config["baidu-host"].url != host){
            return;
        }
        var hm = document.createElement('script');
        hm.src =config["baidu-host"].url+'?' + config["baidu-host"].token;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
    });
});
