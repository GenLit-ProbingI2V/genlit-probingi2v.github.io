window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

document.addEventListener("DOMContentLoaded", function () {
  class VideoSlider {
      constructor(section, fps, totalFrames) {
          this.section = section; // Section element
          this.videos = section.querySelectorAll("video"); // Target videos
          this.slider = section.querySelector(".frame-slider"); // Target slider
          this.playPauseButton = section.querySelector(".play-pause-button"); // Play/Pause button
          this.fps = fps; // Frames per second
          this.totalFrames = totalFrames; // Total number of frames
          this.isPlaying = false; // Play state
          this.playInterval = null; // Interval for playback

          this.init();
      }

      init() {
          this.bindEvents();
          this.play();
      }

      bindEvents() {
          // Sync videos with slider input
          this.slider.addEventListener("input", () => {
              const frameNumber = parseInt(this.slider.value, 10);
              const time = frameNumber / this.fps;

              this.videos.forEach(video => {
                  video.currentTime = time; // Sync video current time
              });
          });

          // Play/Pause button functionality
          this.playPauseButton.addEventListener("click", () => {
              if (this.isPlaying) {
                  this.pause();
              } else {
                  this.play();
              }
          });
      }

      play() {
          this.isPlaying = true;
          this.playPauseButton.textContent = "Pause";

          // Calculate interval based on FPS
          const intervalTime = 1000 / this.fps; // Corrected interval to 1000ms per frame
          this.playInterval = setInterval(() => {
              const currentFrame = parseInt(this.slider.value, 10);

              if (currentFrame < this.totalFrames - 1) {
                  this.slider.value = currentFrame + 1; // Move slider to the next frame
              } else {
                  this.slider.value = 0; // Reset to the first frame
              }

              // Update the video current time
              const time = this.slider.value / this.fps;
              this.videos.forEach(video => {
                  video.currentTime = time; // Set video time to match slider
              });
          }, intervalTime);
      }


      pause() {
          this.isPlaying = false;
          this.playPauseButton.textContent = "Play";
          clearInterval(this.playInterval); // Stop playback interval
      }
  }


  // Apply VideoSlider functionality to all sections
  const sections = document.querySelectorAll(".video-section");
  sections.forEach(section => {
      new VideoSlider(section, 4, 14); // FPS = 4, Total Frames = 14
  });
});

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    // preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})
