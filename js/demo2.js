var ww = window.innerWidth;
var wh = window.innerHeight;
var isMobile = ww < 500;

const global = {
  myTime: 13000,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null
}

const textureLoader = new THREE.TextureLoader()
const fontLoader = new THREE.FontLoader()
const texturePNG = textureLoader.load('/img/texture/Chunnel_All-7.png')
texturePNG.wrapS = THREE.RepeatWrapping;
texturePNG.wrapT = THREE.RepeatWrapping;

function Tunnel() {
  this.init();
  this.createMesh();

  this.handleEvents();

  window.requestAnimationFrame(this.render.bind(this));
}

Tunnel.prototype.init = function() {

  this.speed = 1;
  this.prevTime = 0;

  this.mouse = {
    position: new THREE.Vector2(ww * 0.5, wh * 0.7),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5, wh * 0.7)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#scene")
  });
  this.renderer.setSize(ww, wh);

  this.camera = new THREE.PerspectiveCamera(10, ww / wh, 0.01, 100);
  this.camera.rotation.y = Math.PI;
  this.camera.position.z = 0.221;

  this.scene = new THREE.Scene();
  // this.scene.fog = new THREE.Fog("rgb(243, 240, 239)",0,1.);

  // var light = new THREE.HemisphereLight( 0xe9eff2, 0x01010f, 1 );
  var light = new THREE.HemisphereLight( 0xffffff, 0xfffffff, 1 );
  this.scene.add( light );


  this.addParticle();
};

Tunnel.prototype.addParticle = function() {


  this.particles = [];
  this.texts = [];
  // fontLoader.load('./fonts/OpenType-TT/Namastate_Bold.json', (font) => {
    for (var i = 0; i < 60; i++) {
      this.particles.push(new Particle(this.scene, false, 100, i));
      // this.texts.push(new Text(this.scene, true, 1000, global.fontLoader, "..."))
      global.iForPositionZ = i
    }
  // })
};

Tunnel.prototype.createMesh = function() {
  var points = [];
  var i = 0;

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
     points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
  }
  points[4].y = 0;

  this.curve = new THREE.CatmullRomCurve3(points);
  this.curve.type = "catmullrom";

  geometry = new THREE.Geometry();
  geometry.vertices = this.curve.getPoints(70);
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  this.tubeMaterial = new THREE.PointsMaterial({
    side: THREE.BackSide,
    color: "rgb(243, 240, 239)",
  });

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, .007, 30, true);
  this.tubeGeometry_o = this.tubeGeometry.clone();
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);

  this.scene.add(this.tubeMesh);

  this.geometry1 = new THREE.PlaneGeometry( 1, 1 );
  this.material1 = new THREE.MeshBasicMaterial( {color: "rgb(243, 240, 239)", side: THREE.DoubleSide} );
  this.plane = new THREE.Mesh( this.geometry1, this.material1 );
  this.plane.position.set(0, 0, 0.9)
  this.plane.scale.set(.03, .03, .03)
  this.scene.add( this.plane );


};

Tunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false);

  document.body.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  // document.body.addEventListener('touchmove', this.onMouseMove.bind(this), false);

  // document.body.addEventListener('touchstart', this.onMouseDown.bind(this), false);
  //mousedown
  // document.body.addEventListener('mousedown', this.onMouseDown.bind(this), true);

  // document.body.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  // document.body.addEventListener('mouseleave', this.onMouseUp.bind(this), false);
  // document.body.addEventListener('touchend', this.onMouseUp.bind(this), false);
  // window.addEventListener('mouseout', this.onMouseUp.bind(this), false);
};

Tunnel.prototype.onMouseDown = function() {
  this.mousedown = true;
  TweenMax.to(this.scene.fog.color, 0.6, {
    r: 1,
    g: 1,
    b: 1
  });
  TweenMax.to(this.tubeMaterial.color, 0.6, {
    r:0,
    g:0,
    b:0
  });
  TweenMax.to(this, 1.5, {
    speed: 1.5,
    ease: Power2.easeInOut
  });
};
Tunnel.prototype.onMouseUp = function() {
  this.mousedown = false;
  TweenMax.to(this.scene.fog.color, 0.6, {
    r:0,
    g:0.050980392156862744,
    b :0.1450980392156863
  });
  TweenMax.to(this.tubeMaterial.color, 0.6, {
    r:1,
    g:1,
    b:1
  });
  TweenMax.to(this, 0.6, {
    speed: 1,
    ease: Power2.easeInOut
  });
};

Tunnel.prototype.onResize = function() {
  ww = window.innerWidth;
  wh = window.innerHeight;

  isMobile = ww < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.onMouseMove = function(e) {
  if (e.type === "mousemove"){
    this.mouse.target.x = e.clientX;
    this.mouse.target.y = e.clientY;
  } else {
    this.mouse.target.x = e.touches[0].clientX;
    this.mouse.target.y = e.touches[0].clientY;
  }
};

Tunnel.prototype.updateCameraPosition = function() {

  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 110;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 110;

  this.mouse.ratio.x = (this.mouse.position.x / ww);
  this.mouse.ratio.y = (this.mouse.position.y / wh);

  this.camera.rotation.z = ((this.mouse.ratio.x) * 1 - 0.05);
  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.3 - 0.15);
  this.camera.position.x = ((this.mouse.ratio.x) * 0.044 - 0.025);
  this.camera.position.y = ((this.mouse.ratio.y) * 0.044 - 0.025);

};

Tunnel.prototype.updateCurve = function() {
  const i = 0;
  let index = 0;
  let vertice_o = null;
  let vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 15;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 15;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[2].x = 0.6 * (1 - this.mouse.ratio.x) - 0.1;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = 0.6 * (1 - this.mouse.ratio.x) - 0.1;

  this.curve.points[2].y = 0.6 * (1 - this.mouse.ratio.y) - 0.1;
  this.curve.points[3].y = 0;
  this.curve.points[4].y = 0.6 * (1 - this.mouse.ratio.y) - 0.1;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
};

Tunnel.prototype.render = function(time) {

  // this.updateCameraPosition();

  // this.updateCurve();

  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    if(this.particles[i].burst && this.particles[i].percent > 1){
      this.particles.splice(i, 1);
      i--;
    }
  }
  // When mouse down, add a lot of shapes
  // if (this.mousedown){
  //   if(time - this.prevTime > 0){
  //     this.prevTime = time;
  //     this.particles.push(new Particle(this.scene, true, time));
  //     if(!isMobile){
  //       this.particles.push(new Particle(this.scene, true, time));
  //     }
  //   }
  // }

  this.renderer.render(this.scene, this.camera);

  // window.requestAnimationFrame(this.render.bind(this));
};

function Particle(scene, burst, time, i) {
  const myTime = global.myTime
  const radius = .0008;
  let geom = this.icosahedron;
  const random = true;
  if(random){
    geom = this.plane
  }
  const range = 1150;
  if(burst){
    this.color = new THREE.Color("hsl("+(time / 50)+",100%,60%)");
  } else {
    const offset = 1180;
    this.color = new THREE.Color("hsl("+(Math.random()*range+offset)+",100%,80%)");
  }
  const mat = new THREE.MeshBasicMaterial({
    map: texturePNG,
    color: this.color,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 0);
  // this.percent = burst ? 1.2 : Math.random();
  // console.log(Math.random())
  const min = 0.7, max = 0.801
  this.percent = burst ? .2 : i * .06; //  * (max - min) + min
  this.burst = burst ? true : false;
  this.offset = new THREE.Vector3(0, 0, .2);
  this.speed = 0.0006;
  if (!this.burst){
    this.speed *= 1;
    this.mesh.scale.x *= 6.4;
    this.mesh.scale.y *= 6.4;
    this.mesh.scale.z *= 6.4;
  }
    // this.rotate = new THREE.Vector3(-Math.random()*0.1+0.01,0,Math.random()*0.01);

  this.pos = new THREE.Vector3(0,0, global.iForPositionZ * 0.007)
  // this.pos = new THREE.Vector3(0, 0, 1)

  scene.add(this.mesh)
}

function Text (scene, burst, time, font, text) {
    const textGeometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    })
  textGeometry.center()

  const textRange = 1150

  if(burst){
    this.color = new THREE.Color("hsl("+(time / 50)+",100%,60%)")
  } else {
    const offset = 1180
    this.color = new THREE.Color("hsl("+(Math.random()*textRange+offset)+",100%,80%)")
  }

  const textMaterial = new THREE.MeshBasicMaterial({color: this.color})

  this.textMesh = new THREE.Mesh(textGeometry, textMaterial)
  this.textMesh.scale.set(0.0001, 0.0001, 0.0001)
  this.textMesh.position.set(0, 0.00075, global.iForPositionZ * 0.007)

  scene.add(this.textMesh)
}

// Particle.prototype.plane = new THREE.TorusKnotGeometry( 15, .5, 3, 224 );
Particle.prototype.plane = new THREE.PlaneGeometry( 2, 2 );

const clock = new THREE.Clock()

Particle.prototype.update = function (tunnel) {
  const elapsedTime = clock.getElapsedTime()
  global.elapsedTime = elapsedTime
  this.mesh.position.z = this.pos.z;

  if(global.scrollWhere === "down") {
    this.percent += -this.speed * (this.burst ? 1 : tunnel.speed + 1)

  } else {
    this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
  }
  this.pos = tunnel.curve.getPoint(1 - (this.percent%1)).add(this.offset);
  this.mesh.position.x = this.pos.x;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;


};

window.onload = function() {
  fontLoader.load('./fonts/OpenType-TT/Namastate_Bold.json', (font) => {
    global.fontLoader = font
    console.log(font)
    window.tunnel = new Tunnel()
  })

  window.addEventListener('mousewheel', (event) => {
    if(event.deltaY > 0) {
      // scrollDown
      global.scrollWhere = 'down'
      window.tunnel.render()
    } else {
      //scrollTop
      global.scrollWhere = 'top'
      window.tunnel.render()
    }


  })
};