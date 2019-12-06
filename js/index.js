// var videos = [
//   {
//     name: '#1-First Snow Fall',
//     id: videoUrl,
//     startSeconds: 350,
//     endSeconds: 420
//   },
//   {
//     name: '#2-Jessica\'s First Day of School',
//     id: videoUrl,
//     startSeconds: 422,
//     endSeconds: 531
//   },
//   {
//     name: '#3-My Flower Garden',
//     id: videoUrl,
//     startSeconds: 535,
//     endSeconds: 593
//   },
//   {
//     name: '#4-Going Camping',
//     id: videoUrl,
//     startSeconds: 597,
//     endSeconds: 665
//   },
//   {
//     name: '#5-My House',
//     id: videoUrl,
//     startSeconds: 665,
//     endSeconds: 740
//   },
//   {
//     name: '#6-My First Pet',
//     id: videoUrl,
//     startSeconds: 741,
//     endSeconds: 805
//   },
//   {
//     name: '#7-Jennifer the Firefighter',
//     id: videoUrl,
//     startSeconds: 807,
//     endSeconds: 105
//   },
//   {
//     name: '#8-Mark\'s Big Game',
//     id: videoUrl,
//     startSeconds: 1007,
//     endSeconds: 1130
//   },
//   {
//     name: '#9-The Easter Egg Hunt',
//     id: videoUrl,
//     startSeconds: 1510,
//     endSeconds: 1900
//   }
// ];

//Start Youtube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = new Array();
var startClick = false;

function onYouTubeIframeAPIReady(){
  var count = 0;

  db.collection("videos").orderBy("order").get().then(function(querySnapshot) {

    jQuery(".youtube-video").each(function(i, obj)  {
      querySnapshot.forEach(function(doc) {
        let video = doc.data();
        $(`#caption${count}`).html(video.name);
        players[obj.id] = new YT.Player(obj.id, {     
          playerVars: {
            controls: 2,
            rel: 0,
            autohide: 1,
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
        count++;
      });
    });

  });
}

//Functions for Event's API
function onPlayerReady(event) {
  var id = getIdFrame(event);
  var video = getVideo(id);
  event.target.cueVideoById(video);
}

function onPlayerStateChange(event) {
  startedVerify(event);
  loopedVerify(event);
};

function startedVerify(event){
  if (event.data === YT.PlayerState.PLAYING && startClick) {
    var id = getIdFrame(event);
    event.target.loadVideoById(getVideo(id));
    startClick = false;
  }
}

function loopedVerify(event){
  if (event.data === YT.PlayerState.ENDED && shouldedRepeat()) {
    var id = getIdFrame(event);
    var video = getVideo(id);
    event.target.loadVideoById(video);
  }
}

async function getVideo(index) {
  const videos = [];
  await db.collection("videos").orderBy("order").get()
  .then(function(querySnapshot) {
    querySnapshot.docs.map(function(doc) {
      videos.push(doc.data());
    });
   });
  
   return videos[index]
}

function getIdFrame(event) {
  return jQuery(event.target.getIframe()).attr("id");
}

function shouldedRepeat(){
  return $('#ipt-repeat:checked').val() === "on";
}

//General DOM Event's
$(document).ready(function() {

  $("#start").click(function() {
    var id = $('.video-container.item.active').children()[0].id;
    var player = players[id];
    player.stopVideo();
    player.playVideo();
    startClick = true;
  });

  $( document ).ready(function(){
    //   Hide the border by commenting out the variable below
        var $on = 'section';
        $($on).css({
          'background':'none',
          'border':'none',
          'box-shadow':'none'
        });
    }); 

});