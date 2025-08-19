const s = (p) => {
  let demo8Shader, img, fft, d_map, audio, playBtn, toggleBtn;

  p.preload = () => {
    audio = p.loadSound('audio/demo8.mp3');
    demo8Shader = p.loadShader('shaders/base.vert', 'shaders/d8.frag');
    img = p.loadImage('img/8.png');
    d_map = p.loadImage('img/clouds.jpg');
  };

  p.setup = () => {
    playBtn = document.querySelector('#play-btn');
    playBtn.addEventListener('click', () => {
      document.body.classList.add('start-anim');
      audio.loop();
    });

    p.pixelDensity(1);
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.setAttributes('alpha', true); // allow transparent clearing in WEBGL
    p.noStroke();

    toggleBtn = document.querySelector('#toggle-btn');
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('toggle--on');
      toggleAudio();
    });

    fft = new p5.FFT();
    p.shader(demo8Shader);

    // set static uniforms
    demo8Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
    demo8Shader.setUniform('d_map', d_map);
    demo8Shader.setUniform('u_texture', img);
    demo8Shader.setUniform('u_tResolution', [img.width, img.height]);
  };

  p.draw = () => {
    p.clear(); // transparent background
    p.background(0); // optional black fallback

    fft.analyze(); // analyze audio

    // get FFT energy
    const bass = fft.getEnergy("bass");
    const treble = fft.getEnergy("treble");
    const mid = fft.getEnergy("mid");

    // map values
    const mapBass = p.map(bass, 0, 255, 5, 10.0);
    const mapTreble = p.map(treble, 0, 255, 0, 0.0);
    const mapMid = p.map(mid, 0, 255, 0.0, 0.1);

    // update shader uniforms
    demo8Shader.setUniform('u_time', p.frameCount / 20);
    demo8Shader.setUniform('u_bass', mapBass);
    demo8Shader.setUniform('u_tremble', mapTreble);
    demo8Shader.setUniform('u_mid', mapMid);

    // draw background rect (WEBGL coordinates)
    p.fill(255, 0, 0);
    p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    demo8Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
  };

  function toggleAudio() {
    if (audio.isPlaying()) {
      audio.pause();
    } else {
      audio.loop();
    }
  }
};

new p5(s);








