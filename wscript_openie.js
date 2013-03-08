function alert(msg){
	WScript.Echo(msg);
};

var ie=new ActiveXObject("InternetExplorer.Application");
ie.navigate("http://www.ctrip.com");
ie.visible=1;
var docX;


(function(){
	try{
		docX=ie.document;
		var win=docX.parentWindow;
		var doc=win.document;
		// var h1=doc.createElement('h1');
		
		// win.alert();
		// h1.innerHTML='just hack it!!!';
		// doc.body.insertBefore(h1,doc.body.firstChild);
		// win.alert("hello world");

	}catch(e){
		WScript.Sleep(100);
		arguments.callee();
		return;
	}
	WScript.Sleep(8000);
	var price = doc.getElementById("hdivResultPanel").innerHTML;
	var styles = "<style>" +doc.getElementsByTagName("style")[1].styleSheet.cssText+"</style>" ;
	/*var style = "";
	for(var i=0,l=styles.length; i<l; i++){
		var x = styles[i].innerHTML;
		alert(x);
		if(/js\-/.test(x)){
			style = styles[i].outerHTML;
			break;
		}
	}*/
	var str = styles+price;
              // win.alert(str);
	var fso, tf;
	fso = new ActiveXObject("Scripting.FileSystemObject");
	tf = fso.CreateTextFile("d:\\test\\testfile.html", true);
	tf.Write(str) ;
	tf.Close(); 
	// alert("finish");
	ie.Quit();
})();


