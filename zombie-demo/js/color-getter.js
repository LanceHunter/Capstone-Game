let video = document.getElementById('video');
function getColorAt(webcam, x, y) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = video.width;
  canvas.height = video.height;
  context.drawImage(video, 0, 0, video.width, video.height);

  var pixel = context.getImageData(x, y, 1, 1).data;
  return {r: pixel[0], g: pixel[1], b: pixel[2]};
}
window.addEventListener("click", function (e) {
  console.log('clicked');
  var color = getColorAt(video, e.offsetX, e.offsetY);
  console.log(color.r, color.g, color.b);
});
