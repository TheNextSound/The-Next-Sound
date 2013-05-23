$(document).ready(function(){

	//CHECK IF BROWSER SUPPORTS MP4	
	if( $('.videoPlayer')[0].canPlayType('video/mp4') != '' ){
		videoType = 'mp4';
	}else{
		videoType = 'webm';
		$('.videoPlayer').each(function(){
			var curSrc = $(this).attr('src');
			var newSrc = curSrc.replace('mp4',videoType);
			$(this).attr('type','video/'+videoType).attr('src',newSrc);
		});
	}
	
	//GLOBAL VARIABLES
	totalVideo = 5;
	currentVideo = 1;
	currentGenre = 'blue';
	folder = 'scenes/';
	
	function newVideo(i,g,c){ //i = ID, g = Genre, c = Class
		var html = '<video class="videoPlayer '+c+'" id="scene'+i+'" preload="auto" src="'+folder+g+'/scene'+i+'.'+videoType+'" type="video/'+videoType+'"></video>';
		return html;
	}
	function srcPath(i,g){ //i = ID, g = Genre
		var src = folder+g+'/scene'+i+'.'+videoType;
		return src;
	}
	
	//Make video ready
	$('.videoPlayer').addClass('first').wrap('<div id="playerDiv">');
	
	var video2 = newVideo(currentVideo+1,currentGenre,'next');
	$('#playerDiv').append(video2);
	
	//Bind Ended
	$('.videoPlayer').bind('ended', function(){	
		var curVidID = $(this).attr('id');
		nextScene('#'+curVidID);
	});
	
	//Function To Bind
	function nextScene(i){ //i = ID of current video
		//Current Video
		var curVidID = i;
		var curVidNR = Number( curVidID.replace('#scene','') );
		if(curVidNR == totalVideo) $(curVidID).addClass('last'); //last video
		$('.videoPlayer:first, '+curVidID).removeClass('playing');
		
		//Next Video
		var nextVidNR = curVidNR+1;
		var nextVidID = '#scene'+nextVidNR;
		
		if(nextVidNR <= totalVideo){
			$(nextVidID)[0].play();
			$(nextVidID).addClass('playing').removeClass('next');
		}
				
   		//Set New Genre On Current Video
	   	changeGenre(currentGenre);
   			
   		//Preload Upcoming Scene
  		var upcomID = curVidNR + 2;
   		if(upcomID <= totalVideo){
   			var html = newVideo(upcomID,currentGenre,'next');
   			$('#playerDiv').append(html);
   		}
   		$('.videoPlayer').unbind('ended').bind('ended', function(){
   			nextScene(nextVidID);
   		});
   		
   		//Reset Global Variable
   		currentVideo = nextVidNR;
	}
	
	
	//Controls
	$('.start').click(function(){
		$('.first')[0].play();
		$('.first').addClass('playing').removeClass('first');
	});
	
	$('.playpause').click(function(){
		if( $('.playing').hasClass('paused') ){
			$('.paused')[0].play();
			$('.paused').removeClass('paused');
		}else{
			$('.playing')[0].pause();
			$('.playing').addClass('paused');
		}
	});
	
	//Make Change
	$('.change').click(function(){
		var newGenre = $(this).data('genre');
		changeGenre(newGenre);
		
		$('#change').children().removeClass('active');
		$('.'+newGenre).addClass('active');
	});
	
	function changeGenre(g){ //g = New Genre	
		var duration = $('#scene'+currentVideo)[0].duration;
		var curTime = $('#scene'+currentVideo)[0].currentTime;
		var timeTillEnd = duration - curTime;
		
		if(timeTillEnd < 5){
			changeNot = '.playing, .next';
		}else{
			changeNot = '.playing';
		}
		
		$('.videoPlayer').each(function(){
			if( !$(this).is(changeNot) ){
				var thisID = $(this).attr('id').replace('scene','');
				var newSrc = srcPath(thisID, g);
				$(this).attr('src',newSrc);
			}
		});
		
		//Reset Global Variables
		currentGenre = g;
	}
	
	//Remove Context Menu
	$('.videoPlayer').bind('contextmenu',function(){
		//return false;
	});
});