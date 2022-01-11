var clickINdex=0;
function YuSvideo(oTime,oName,oUrl){
				var olast=clickINdex;
				clickINdex++;
				var oldId='o'+olast;
				var newId='o'+clickINdex;

				oTime = oTime.replace(new RegExp("-","gm"),"/");
				oTime=(new Date(oTime)).getTime();
				// oTime=new Date(oTime).getTime();

				var strStartTime=new Date(oTime-15000).Format("yyyy-MM-dd hh:mm:ss");
				var strEndTime=new Date(parseInt(oTime)+1500).Format("yyyy-MM-dd hh:mm:ss");
				var rePlay=oUrl.replace(/livePlay.php/g,'rePlay.php')
				var oUrlPlay=rePlay+"&camname="+oName+"&strStartTime="+strStartTime+"&strEndTime="+strEndTime;
				if (oUrlPlay) {
					var a = document.getElementById("YuSvideo");
					var iframe = document.getElementById(oldId);
					if (iframe) {
						iframe.src = "about:blank";
					
					try {
						iframe.contentWindow.document.write('');
					} catch (e) {
					}
					try {
						iframe.contentWindow.document.clear();
					} catch (e) {
					}
					try {
						iframe.contentWindow.close();
					} catch (e) {
					}
					a.removeChild(iframe);
					}
					var div = document.createElement("iframe");
					div.setAttribute("id", newId);
					div.setAttribute("width","1210");
					div.setAttribute("height","700"); 
					div.setAttribute("frameborder","none");
					div.setAttribute("src",oUrlPlay);
					a.appendChild(div);
				}
};