$(document).ready(function(){

var amazonUrl = ""
function sha256(stringToSign, secretKey) {
  var hex = CryptoJS.HmacSHA256(stringToSign, secretKey);
  return hex.toString(CryptoJS.enc.Base64);
} 

function timestamp() {
    var date = new Date();
    var y = date.getUTCFullYear().toString();
    var m = (date.getUTCMonth() + 1).toString();
    var d = date.getUTCDate().toString();
    var h = date.getUTCHours().toString();
    var min = date.getUTCMinutes().toString();
    var s = date.getUTCSeconds().toString();

    if(m.length < 2) { m = "0" + m; }
    if(d.length < 2) { d = "0" + d; }
    if(h.length < 2) { h = "0" + h; }
    if(min.length < 2) { min = "0" + min; }
    if(s.length < 2) { s = "0" + s}

    var date = y + "-" + m + "-" + d;
    var time = h + ":" + min + ":" + s;
    return date + "T" + time + "Z";
}

function getAmazonItemInfo(keyword) {
    var PrivateKey = "/nmngLta6ifXG0RjOzoICN0cMqRlUp9m9LwlIrOj";
    var PublicKey = "AKIAIGNV6AJOIUYCURCA";
    var AssociateTag = "shopsmart093-20";

    var parameters = [];
    parameters.push("AWSAccessKeyId=" + PublicKey);
    parameters.push("SearchIndex=All");
    parameters.push("Keywords=" + keyword);
    parameters.push("Operation=ItemSearch");
    parameters.push("ResponseGroup=Images%2CItemAttributes%2COffers");
    parameters.push("Service=AWSECommerceService");
    parameters.push("Timestamp=" + encodeURIComponent(timestamp()));
	parameters.push("AssociateTag=" + AssociateTag);

    parameters.sort();
    var paramString = parameters.join('&');

    var signingKey = "GET\n" + "webservices.amazon.com\n" + "/onca/xml\n" + paramString
    console.log(signingKey);
    var signature = sha256(signingKey,PrivateKey);
        signature = encodeURIComponent(signature);

    amazonUrl =  "http://webservices.amazon.com/onca/xml?" + paramString + "&Signature=" + signature;
    console.log(amazonUrl);
}
	function getData(amazonUrl) {
		var queryURL = "https://crossorigin.me/"+amazonUrl;
			$.ajax({url: queryURL, dataType: "xml", method: "GET"}).done(function(response) {
                console.log(response);
		});

	}

    function displayData(response) {
        $("#product-info").append("<img src='"+response.getElementsByTagName+"'>")
    }
    function next() {
        if (i < x.length-1) {
          i++;
          displayData(i);
          }
    }

    function previous() {
        if (i > 0) {
          i--;
          displayData(i);
          }
    }

	$("body").on("click", "#product-search", function() {
		product = $("#product-name").val();
		console.log(product);
		getAmazonItemInfo(product);
		getData(amazonUrl);
	});

});
