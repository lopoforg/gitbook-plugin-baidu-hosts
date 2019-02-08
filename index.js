module.exports = {
    book: {
        assets: "./book",
        js: [
            "plugin.js"
        ]
	},
	hooks: {
		'page:before': processTitle,
		'finish': makeTitle
	},
	filters: {
	    dateformat: function(date,fmt) {
	    	// 将 Date 转化为指定格式的String
	    	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	    	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	    	// 例子： 
	    	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	    	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	    	var o = {
	    	        "M+": date.getMonth() + 1, //月份 
	    	        "d+": date.getDate(), //日 
	    	        "h+": date.getHours(), //小时 
	    	        "m+": date.getMinutes(), //分 
	    	        "s+": date.getSeconds(), //秒 
	    	        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
	    	        "S": date.getMilliseconds() //毫秒 
	    	    };
	    	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    	    for (var k in o)
	    	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    	    return fmt;
	    }
	}

};
var titleRule = /^\s*```\s{0,4}title((.*[\r\n]+)+?)?\s*```$/im;

const htmlent = require('html-entities');
const fs = require('fs');

function processTitle(page) {
  var match;
  if(match = titleRule.exec(page.content)) {
    var rawBlock = match[0];
    var seoBlock = match[1].replace(/[\r\n]/mg, "");
    //seoBlock = htmlent.Html5Entities.decode(seoBlock);
    page.content = page.content.replace(rawBlock, '<div id="meta-title---">' + seoBlock + '</div>');
  }
  return page;
}
function makeTitle() {
  var rootDir = this.output.root();
  var ignoreDir = rootDir + "/" + "gitbook";
  var batchModify = function(rootDir){
    fs.readdir(rootDir, function(err,files){
      for(var i=0; i<files.length; i++) {
        var file = files[i];
        var fpath = rootDir + "/" + file;
        if (/\.html$/.test(file)) {
          var data = fs.readFileSync(fpath, 'utf-8');
          var rule =/<tile[^>]+>/im;
          var rule2 = /<div id="meta-title---">([^>]+)?<\/div>/;
          var match1, match2, match3, match4;
          match1 = rule.exec(data);
          if (match1) {
            match2 = rule2.exec(data, match1[0].index + match1[0].length);
            if (match2) {
              data = data.replace(match2[0], '');
              var seoDesc = '<title>'+htmlent.Html5Entities.decode(match2[1]) + '</title>';
              data = data.replace(match1[0], seoDesc);
              fs.writeFileSync(fpath, data, 'utf-8');
            }
          } 
        } else if (fpath != "."       && 
                   fpath != ".."      &&
                   fpath != ignoreDir &&
                   fs.lstatSync(fpath).isDirectory()) {
          batchModify(fpath);
        }
      }
    });
  };

  batchModify(rootDir);
}

