function FindProxyForURL(url, host) {
    var D = "DIRECT";
    if (isPlainHostName(host) || 
		shExpMatch(host, "*.localhost") || 
		isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") || 
		isInNet(dnsResolve(host), "172.16.0.0",  "255.240.0.0") || 
		isInNet(dnsResolve(host), "192.168.0.0",  "255.255.0.0") || 
		isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0"))
		return D;
	if (shExpMatch(host, "*.abercrombie.com") || 
		shExpMatch(host, "*.tommy.com") || 
		shExpMatch(host, "*.calvinklein.com") || 
		shExpMatch(host, "www.sephora.com") || 
		shExpMatch(host, "*.nordstrom.com") || 
		shExpMatch(host, "*.nordstromimage.com") || 
		shExpMatch(host, "www.belk.com") || 
		shExpMatch(host, "*.abercrombie.com") || 
		shExpMatch(host, "*.nike.com") || 
		shExpMatch(host, "*.hollisterco.com") || 
		shExpMatch(host, "www.groupon.com") || 
		shExpMatch(host, "*.target.com") || 
		shExpMatch(host, "*.targetimg1.com") || 
		shExpMatch(host, "*.guess.com") || 
		shExpMatch(host, "*.asos.com") || 
		shExpMatch(host, "*.tigerdirect.com") || 
		shExpMatch(host, "*.stevesblindsandwallpaper.com") || 
		shExpMatch(host, "*.puritan.com") || 
		shExpMatch(host, "*.kohls.com") || 
		shExpMatch(host, "*.sportchalet.com") || 
		shExpMatch(host, "*.timbuk2.com") || 
		shExpMatch(host, "*.googleapis.com") || 
		shExpMatch(host, "*.uggaustralia.com") || 
		shExpMatch(host, "*.bonton.com") || 
		shExpMatch(host, "*.lacoste.com") || 
		shExpMatch(host, "*.jcpenney.com") || 
		shExpMatch(host, "*.edgesuite.net") || 
		shExpMatch(host, "*.akamai.net") || 
		shExpMatch(host, "*.hipp.de") || 
		shExpMatch(host, "*.cybershop.de") || 
		shExpMatch(host, "*.windeln.de"))
		return "HTTPS usa1.y700.com:8080;HTTPS usa2.y700.com:8080";
    return D;
}