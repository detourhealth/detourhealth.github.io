var defaultStorage = firebase.storage();
var storageRef = defaultStorage.ref();
var db = firebase.firestore();

var urlParams = new URLSearchParams(window.location.search);
var epi = urlParams.get('ep');
if (epi == null){
  location.href = "/404";
}
//console.log(epi);

var podcast_audio;

var docRef = db.collection("podcasts").doc(epi);
var totalData;
docRef.get().then(function(doc) {
  if (doc.exists) {
      console.log("Document data:", doc.data());
      totalData = doc.data();

      storageRef.child(totalData.thumbnail).getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'
        //console.log(url);
        document.getElementById("thumb").src = url;

      }).catch(function(error) {
        document.getElementById("thumb").src = "../../images/podcast_thumbnails/episode_generic.png";
      });

      document.getElementById("ep_desc").innerHTML = totalData.desc;

      storageRef.child(totalData.audio).getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'
        document.getElementById("listenButton").style.display = "block";
        podcast_audio = new Audio(url);
        podcast_audio.ontimeupdate = function(){updateTime()};


      }).catch(function(error) {

      });

  } else {
      // doc.data() will be undefined in this case
      //console.log("No such document!");
      location.href = "/404";
  }
}).catch(function(error) {
    console.log("Error getting document:", error);
    location.href = "/404";
});

var current_time_seconds;
var neg_secs;
var current_time_mins;
var neg_mins;
var pod_duration;
function playPause(){
  if(document.getElementById("play_pause").getAttribute('src') == "../../images/podcast_player/play.png"){
    podcast_audio.play();
    document.getElementById("play_pause").setAttribute('src', "../../images/podcast_player/pause.png");

  }
  else{
    podcast_audio.pause();
    document.getElementById("play_pause").setAttribute('src', "../../images/podcast_player/play.png");
  }

}
function adjustTimeForward(){
  podcast_audio.currentTime = 	podcast_audio.currentTime + 30;
}
function adjustTimeBackward(){
  podcast_audio.currentTime = 	podcast_audio.currentTime - 30;
}

function seek(e) {
    var percent = e.offsetX / this.offsetWidth;
    podcast_audio.currentTime = percent * podcast_audio.duration;
}



function updateTime(){
  current_time_seconds = Math.floor(podcast_audio.currentTime);
  neg_secs = Math.floor(podcast_audio.duration - current_time_seconds);
  current_time_minutes = Math.floor(current_time_seconds/60);
  neg_mins = Math.floor(neg_secs/60);
  neg_secs = neg_secs - (neg_mins*60);
  current_time_seconds = current_time_seconds - (current_time_minutes * 60);
  if(current_time_seconds < 10){
    current_time_seconds = '0' + current_time_seconds;
  }
  if(neg_secs < 10){
    neg_secs = '0' + neg_secs;
  }
  if(current_time_minutes < 10){
    current_time_minutes = '0' + current_time_minutes;
  }
  if(neg_mins < 10){
    neg_mins = '0' + neg_mins;
  }

  document.getElementById("count_up").innerHTML = current_time_minutes + ':' + current_time_seconds;
  document.getElementById("count_down").innerHTML = '-' + neg_mins + ':' + neg_secs;
  document.getElementById("podcast_progress").max = Math.floor(podcast_audio.duration);
  document.getElementById("podcast_progress").value = Math.floor(podcast_audio.currentTime);

  document.getElementById("podcast_progress").addEventListener("click", seek);


}

function openAudioPlayer(){
  document.getElementById("player").style.display = "block";
  podcast_audio.play();
  document.getElementById("play_pause").setAttribute('src', "../../images/podcast_player/pause.png");
}
function closeAudioPlayer(){
  document.getElementById("player").style.display = "none";
  podcast_audio.pause();
  podcast_audio.currentTime=0;
  document.getElementById("play_pause").setAttribute('src', "../../images/podcast_player/play.png");
}
