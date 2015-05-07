var counter=0;

var timerId;
var mainRequestId=null;
var mainStartTime;

var minutesForPomodoro=25;

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
    if(mainRequestId===null){
			startMainRequest();
    }else{
	    	stopMainRequest();
    } 
  });
});

var pollIntervalMain = 1000*60 * minutesForPomodoro;

function startMainRequest() {
	chrome.browserAction.setTitle({title: "Click to stop pomodoro session"});
	chrome.browserAction.setIcon({path: "icon-32-1.png"});
    mainStartTime=new Date();
    counter=0;
    startRequest();
    mainRequestId = window.setTimeout(function(){  stopMainRequest();  show();}, pollIntervalMain);
}

function stopMainRequest() {
		chrome.browserAction.setTitle({title: "Click to start pomodoro session"});
	chrome.browserAction.setIcon({path: "icon-32.png"});
	chrome.browserAction.setBadgeText({text:""});
    window.clearTimeout(mainRequestId);
    mainRequestId=null;
    stopRequest()
}

var pollInterval = 1000;
function startRequest() {
     updateBadge();
     timerId = window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
    window.clearTimeout(timerId);
    timerId=null;
}

function updateBadge() {
	counter++;
	var r=minutesForPomodoro*60-counter;
    var minutes = Math.floor(r / 60);
    var seconds = r - minutes * 60;
     
    var remain=  minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    chrome.browserAction.setBadgeText({text: remain});
 }

function show() {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

  new Notification(hour + time[2] + ' ' + period, {
    icon: 'icon-32.png',
    body: 'Pomodoro session is over. It is time to switch your attention or have a rest.'
  });
}