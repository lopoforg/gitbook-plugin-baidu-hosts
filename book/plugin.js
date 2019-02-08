require(["gitbook"], function(gitbook) {
    gitbook.events.bind("start", function(e, config) {
        config["baidu-tongji"] = config["baidu-tongji"] || {};
        var host = location.host;
        if(config["baidu-tongji"].host != host){
            return
        }
        var hm = document.createElement('script');
        hm.src =config["baidu-tongji"].url+'?' + config["baidu-tongji"].token;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
    });
});