
var AudioFrequency = function (options) {
  this.container = options.container
  this.audio = options.audio
  this.width = options.container.clientWidth
  this.height = options.container.clientHeight
  this.fftSize = options.lineCount * 2
  this.barWidth = this.width / options.lineCount;
  this.createCanvas()
}
var prototype = AudioFrequency.prototype
prototype.createCanvas = function () {
  this.canvas = document.createElement('canvas')
  this.context = this.canvas.getContext("2d");
  this.canvas.width = this.width
  this.canvas.height = this.height
  this.container.appendChild(this.canvas)
}
prototype.start = function () {
  if (!this.AudCtx) {
    this.analyser()
  }
}
prototype.analyser = function () {
  this.AudCtx = new (window.AudioContext || window.webkitAudioContext)();
  var src = this.AudCtx.createMediaElementSource(this.audio);
  this.analyser = this.AudCtx.createAnalyser();
  src.connect(this.analyser);
  this.analyser.connect(this.AudCtx.destination);
  this.analyser.fftSize = this.fftSize;
  this.bufferLength = this.analyser.frequencyBinCount;
  this.dataArray = new Uint8Array(this.bufferLength);
  this.renderFrame()
}
prototype.play = function () {
  if (this.audio.paused) {
    this.audio.play()
  }
  this.start()
}
prototype.renderFrame = function () {
  this.analyser.getByteFrequencyData(this.dataArray);
  this.context.clearRect(0, 0, this.width, this.height);
  for (var i = 0; i < this.bufferLength; i++) {
    var data = this.dataArray[i]
    var barHeight = this.height * data / 255;
    var percentH = i / this.bufferLength;
    var r = data;
    var g = 255 * percentH;
    var b = 50;
    this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    this.context.fillRect(i * this.barWidth, this.height - barHeight, this.barWidth - (this.barWidth / 10 > 1 ? 1 : this.barWidth / 10), barHeight);
  }
  requestAnimationFrame(this.renderFrame.bind(this));
}
