var videoUrl = 'dJaJUAGy47Q';
var videos = [
  {
    id: videoUrl,
    startSeconds: 10,
    endSeconds: 20
  },
  {
    id: videoUrl,
    startSeconds: 20,
    endSeconds: 50
  }
];

//Start Youtube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = new Array();
var loopClick = false;
var startClick = false;

function onYouTubeIframeAPIReady(){
  jQuery(".youtube-video").each(function(i, obj)  {
    players[obj.id] = new YT.Player(obj.id, {      
        playerVars: {
          controls: 2,
          rel:0,
          autohide:1,
          showinfo: 0 ,
          modestbranding: 1,
          wmode: "transparent",
          html5: 1
        },    
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    });
  }

//Functions for Event's API
function onPlayerReady(event) {
  var id = getIdFrame(event);
  event.target.cueVideoById(getVideo(id));
}

function onPlayerStateChange(event) {
  startedVerify(event);
  loopedVerify(event);
  carouselEvents(event);
};

function startedVerify(event){
  if (event.data === YT.PlayerState.PLAYING && startClick) {
    var id = getIdFrame(event);
    event.target.loadVideoById(getVideo(id));
    startClick = false;
  }
}

function loopedVerify(event){
  if (event.data === YT.PlayerState.ENDED && loopClick) {
    var id = getIdFrame(event);
    event.target.loadVideoById(getVideo(id));
  }
}

function getVideo(index) {
  return {
    videoId: videos[index].id,
    startSeconds: videos[index].startSeconds,
    endSeconds: videos[index].endSeconds
  };
}

function getIdFrame(event) {
  return jQuery(event.target.getIframe()).attr("id");
}

//Functions for Carousel
function carouselEvents(event) {
  var target_control =  jQuery(event.target.getIframe()).parent().parent().parent().find(".controls");
  var target_caption = jQuery(event.target.getIframe()).parent().find(".carousel-caption");
  
  switch(event.data){
    case -1:
      jQuery(target_control).fadeIn(500);
      jQuery(target_control).children().unbind('click');
      break
    case 0:
      jQuery(target_control).fadeIn(500);
      jQuery(target_control).children().unbind('click');
      break;
    case 1:
      jQuery(target_control).children().click(function () {return false;});
      jQuery(target_caption).fadeOut(500);
      jQuery(target_control).fadeOut(500);
      break;
      case 2:
        jQuery(target_control).fadeIn(500);
        jQuery(target_control).children().unbind('click'); 
        break;
      case 3:
        jQuery(target_control).children().click(function () {return false;});
        jQuery(target_caption).fadeOut(500);
        jQuery(target_control).fadeOut(500);
        break;
      case 5:
        jQuery(target_control).children().click(function () {return false;});
        jQuery(target_caption).fadeOut(500);
        jQuery(target_control).fadeOut(500);
        break;
      default:
        break;
    }
}

jQuery(window).bind('load', function(){
  jQuery(".carousel-caption").fadeIn(500);
  jQuery(".controls").fadeIn(500);
});

jQuery('.carousel').bind('slid.bs.carousel', function (event) {
  jQuery(".controls").fadeIn(500);
});

//General DOM Event's
$(document).ready(function() {

  $("#loop").click(function() {
    if (loopClick === false){
      $(this).addClass('active')
      loopClick = true;
    } else {
      $(this).removeClass('active')
      loopClick = false;
    }
  });

  $("#start").click(function() {
    var id = $('.video-container.item.active').children()[0].id;
    var player = players[id];
    player.stopVideo();
    player.playVideo();
    startClick = true;
  });

});