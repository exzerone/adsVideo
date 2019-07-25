var adDisplayContainer = new google.ima.AdDisplayContainer(
	document.getElementById('adContainer'),
	videoContent
	);

var videoContent = document.getElementById('videoContent');
var loader = new google.ima.AdsLoader(adDisplayContainer);
var adsManager;
var adsRequest = new google.ima.AdsRequest();

adsRequest.adTagUrl =
	'https://pubads.g.doubleclick.net/gampad/ads?' +
	'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
	'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
	'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';


loader.addEventListener(
	google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
	adsManagerLoaded,
	false
);

loader.addEventListener(
	google.ima.AdErrorEvent.Type.AD_ERROR,
	onAdError,
	false
);

function onAdError(adErrorEvent) {
	console.log(adErrorEvent.getError());
	if (adsManager) {
		adsManager.destroy();
	}
	videoContent.play();
}

function onContentEnded() {
	loader.contentComplete();
}
videoContent.addEventListener('ended', onContentEnded);

function playVideo() {
	if (!adsManager){
		adDisplayContainer.initialize();
		loader.requestAds(adsRequest);
	}
}

function adsManagerLoaded(adsManagerLoadedEvent) {
	adsManager = adsManagerLoadedEvent.getAdsManager(videoContent);

	adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

	adsManager.addEventListener(
		google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
		onContentResumeRequested
	);
	adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
	adsManager.start();
}

function onContentResumeRequested() {
	videoContent.addEventListener('ended', onContentEnded);
	videoContent.play();
}

