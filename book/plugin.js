require(["gitbook"], function(gitbook) {
    gitbook.events.bind("start", function(e, config) {
        config["baidu-hosts"] = config["baidu-hosts"] || {};
        var host = location.host;
        if(config["baidu-hosts"].host != host){
            return
        }
        var hm = document.createElement('script');
        hm.src =config["baidu-hosts"].url+'?' + config["baidu-hosts"].token;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
    });
});