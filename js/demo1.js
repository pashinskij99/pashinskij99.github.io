// Get window dimension
const global = {
  cameraPositionNow: null,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null,
  thisPos: null,
  arrForTexts: [],
  arrForMesh: [],
  camera: null,
  checkModal: false,
  videoIsEnd: false,
  takeCanvas: document.querySelector("#scene"),
  stopped: false,
  positionForTextOnTexture: null,
  leaveFromWindow: false,
  funcInit: null,
  hamburgerIsOpen: false,
  arrForGroup: []
}

var ww = document.documentElement.clientWidth || document.body.clientWidth;
var wh = window.innerHeight;

// Save half window dimension
var ww2 = ww * 0.5, wh2 = wh * 0.5;

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / ww * 2 - 1
  mouse.y = - (event.clientY / wh) * 2 + 1
})

// Constructor function
function Tunnel() {
  // Init the scene and the
  this.init();
  // Create the shape of the tunnel
  this.createMesh();

  // Mouse events & window resize
  this.handleEvents();

  // Start loop animation
  window.requestAnimationFrame(this.render.bind(this));
}

Tunnel.prototype.init = function() {
  // Define the speed of the tunnel
  this.speed = 0.02;

  // Store the position of the mouse
  // Default is center of the screen
  this.mouse = {
    position: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(0, 0)
  };

  // Create a WebGL renderer
  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#scene")
  });
  // Set size of the renderer and its background color
  this.renderer.setSize(ww, wh);
  this.renderer.setClearColor(0x222222);

  // Create a camera and move it along Z axis
  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 1000);
  this.camera.position.z = 0.35;

  // Create an empty scene and define a fog for it
  this.scene = new THREE.Scene();
  // this.scene.fog = new THREE.Fog(0x222222, 0.6, 2.8);
};

Tunnel.prototype.addParticle = function() {
  this.textGeometry = new THREE.PlaneGeometry(0.5, 0.5)
  this.geometry = new THREE.RingGeometry(1, 3, 1)

  this.particles = []
  this.color = []
  this.fir = [69, 149, 163]
  this.sec = [248, 209, 133]
  this.thir = [172, 177, 208]
  this.four = [130, 207, 209]
  this.five = [246, 173, 94]
  this.six = [169, 208, 96]
  this.text = []
  this.firText = ['AWARENESS']
  this.secText = ['NAMA VISION']
  this.thirText = ['JOURNEY']
  this.fourText = ["SENSORIA"]
  this.fiveText = ["ALL GOODS"]
  this.sixText = ['COMMUNITAS']
  this.sevenText = ['CONNECT']
  this.positionForText = []
  this.p1 = [-0.0025, -0.0047, 0, 0]
  this.p2 = [-0.005, -0.0047, 0, 0]
  this.p3 = [-0.009, -0.01, 0, 1]
  this.p4 = [-0.0005, -0.0047, 0, 0]
  this.p6 = [-0.008, -0.012, 0, 1]
  this.p7 = [0.004, -0.0047, 0, -0]
  this.p8 = [0.0034, -0.01, 0, -1]
  for (var i = 0; i <= 124; i++) {  // i <= 124
    global.iForPositionZ = i
    this.positionForText.push(this.p3, this.p1, this.p2, this.p3, this.p4, this.p6, this.p7, this.p8 )
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText)
    this.color.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
    this.particles.push(new Particle(this.scene, false, null, i, null, this.color, this.text, this.positionForText, this.geometry, this.textGeometry ))
  }
};

Tunnel.prototype.createMesh = function() {
  // Empty array to store the points along the path
  var points = [];

  // Define points along Z axis to create a curve
  for (var i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
  }
  // Set custom Y position for the last point
  points[4].y = -0.06;

  // Create a curve based on the points
  this.curve = new THREE.CatmullRomCurve3(points);
  // Define the curve type

  // Empty geometry
  var geometry = new THREE.Geometry();
  // Create vertices based on the curve
  geometry.vertices = this.curve.getPoints(70);
  // Create a line from the points with a basic line material
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  // Create a material for the tunnel with a custom texture
  // Set side to BackSide since the camera is inside the tunnel
  this.tubeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    map: textures.stone.texture,
    bumpMap: textures.stoneBump.texture,
    visible: false
  });
  
  // Add two lights in the scene
  // An hemisphere light, to add different light from sky and ground
  var light = new THREE.HemisphereLight( 0xffffbb, 0x887979, 0.9);
this.scene.add( light );
  // Add a directional light for the bump
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
this.scene.add( directionalLight );
  // Repeat the pattern
  this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
  this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
  this.tubeMaterial.map.repeat.set(30, 6);
  this.tubeMaterial.bumpMap.wrapS = THREE.RepeatWrapping;
  this.tubeMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
  this.tubeMaterial.bumpMap.repeat.set(30, 6);

  // Create a tube geometry based on the curve
  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 50, false);
  // Create a mesh based on the tube geometry and its material
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  // Push the tube into the scene
  this.scene.add(this.tubeMesh);

  // Clone the original tube geometry
  // Because we will modify the visible one but we need to keep track of the original position of the vertices
  this.tubeGeometry_o = this.tubeGeometry.clone();

  this.addParticle()

};
const clickable = document.querySelector("#scene")

Tunnel.prototype.handleEvents = function() {
  // When user resize window
  clickable.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
  window.addEventListener("resize", this.onResize.bind(this), false);
  // When user move the mouse
  document.body.addEventListener(
    "mousemove",
    this.onMouseMove.bind(this),
    false
  );
};

let num1 = 100

Tunnel.prototype.onMouseWheel = function() {

  if(event.deltaY > 0) {
    num1 += event.deltaY * 4.5
    // scrollDown
    global.scrollWhere = 'down'
    TweenMax.to(this, 0, {
      speed: 550 + num1,
      ease: "slow(0.7, 2, false)"
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: "slow(0.7, 2, false)"
      })
      global.scrollWhere = null
      num1 = 100
    }, 200)
  } else  {
    //scrollTop
    global.scrollWhere = 'top'
    num1 += event.deltaY * 4.5
    TweenMax.to(this, 0, {
      speed: 550 - num1,
      ease: "slow(0.7, 2, false)"
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: "slow(0.7, 2, false)"
      })
      num1 = 100
      global.scrollWhere = null
    }, 200)
  }
}

Tunnel.prototype.onResize = function() {
  // On resize, get new width & height of window
  ww = document.documentElement.clientWidth || document.body.clientWidth;
  wh = window.innerHeight;
  ww2 = ww * 0.5;
  wh2 = wh * 0.5;

  // Update camera aspect
  this.camera.aspect = ww / wh;
  // Reset aspect of the camera
  this.camera.updateProjectionMatrix();
  // Update size of the canvas
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.onMouseMove = function(e) {
  // Save mouse X & Y position
  this.mouse.target.x = (e.clientX - ww2) / ww2;
  this.mouse.target.y = (wh2 - e.clientY) / wh2;
};

Tunnel.prototype.updateCameraPosition = function() {
  // Update the mouse position with some lerp
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

  // Rotate Z & Y axis
  this.camera.rotation.z = this.mouse.position.x * 0.2;
  this.camera.rotation.y = Math.PI - this.mouse.position.x * 0.06;
  // Move a bit the camera horizontally & vertically
  this.camera.position.x = this.mouse.position.x * 0.015;
  this.camera.position.y = -this.mouse.position.y * 0.015;
};

Tunnel.prototype.updateMaterialOffset = function() {
  // Update the offset of the material
  this.tubeMaterial.map.offset.x += this.speed;
};

Tunnel.prototype.updateCurve = function() {
  var index = 0, vertice_o = null, vertice = null;
  // For each vertice of the tube, move it a bit based on the spline
  for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
    // Get the original tube vertice
    vertice_o = this.tubeGeometry_o.vertices[i];
    // Get the visible tube vertice
    vertice = this.tubeGeometry.vertices[i];
    // Calculate index of the vertice based on the Z axis
    // The tube is made of 50 rings of vertices
    index = Math.floor(i / 50);
    // Update tube vertice
    vertice.x +=
      (vertice_o.x + this.splineMesh.geometry.vertices[index].x - vertice.x) /
      10;
    vertice.y +=
      (vertice_o.y + this.splineMesh.geometry.vertices[index].y - vertice.y) /
      5;
  }
  // Warn ThreeJs that the points have changed
  this.tubeGeometry.verticesNeedUpdate = true;

  // Update the points along the curve base on mouse position
  this.curve.points[2].x = -this.mouse.position.x * 0.1;
  this.curve.points[4].x = -this.mouse.position.x * 0.1;
  this.curve.points[2].y = this.mouse.position.y * 0.1;

  // Warn ThreeJs that the spline has changed
  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
};

let selectedObject = null,
    max = 2.55, min = 2.9

Tunnel.prototype.render = function() {
  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
    ){
      this.particles.splice(i, 1)
      this.text.splice(i, 1)
      this.color.splice(i, 1)
      i--
    }
  }

  // Update camera position & rotation
  this.updateCameraPosition();

  // Update the tunnel
  this.updateCurve();

  // render the scene
  this.renderer.render(this.scene, this.camera);

  raycaster.setFromCamera(mouse, this.camera)
  this.intersectsGroup = raycaster.intersectObjects(global.arrForGroup, true)

  for (const object of global.arrForGroup) {
    if(!global.checkModal) {
      gsap.to(object.children[0].scale, {x: 0.02, y: 0.02, duration: 4})
      gsap.to(object.children[0].children[0].scale, {x: 1, y: 0.6})
      gsap.to(object.children[0].children[0].material.color, {r: 1, b: 1, g: 1})
      // gsap.to(object.children[0].rotation, {x: 0.004, y: 0.004, z: 1, duration: 2})
      if(global.scrollWhere === 'down' || global.scrollWhere === 'top') {
        // console.log(object.children[0].rotation)
        gsap.to(object.children[0].rotation, { z: Math.random() * (max - min) + min, duration: 2})

        global.takeCanvas.style.cursor = "pointer"
      } else {
        global.takeCanvas.style.cursor = "auto"
      }
    } else {
      global.takeCanvas.style.cursor = "auto"
    }
  }

  if ( this.intersectsGroup.length > 0 ) {

    const res = this.intersectsGroup.filter( function ( res ) {
      return  res.object.children[0]; // res &&
    } )[ 0 ];
    if ( res && res.object ) {

      selectedObject = res.object;
      // console.log(selectedObject.children[0].scale)
      try {
        if( selectedObject.children[0].geometry.type === 'PlaneGeometry') {
          gsap.to(selectedObject.children[0].scale, {x: 1.5, y: 0.6})
          gsap.to(selectedObject.children[0].material.color, {r: 0, b: 0, g: 0})
          gsap.to(selectedObject.scale, {x: 0.015, y: 0.015, duration: 2})
        }
      } catch (e) {
      }
    }

  }

  // Animation loop
  window.requestAnimationFrame(this.render.bind(this));
};
function Particle(scene, burst, canvas, i, texture, color, text, newPosition, geometry, textGeometry) {
  const radius = .002
  this.i = i

  this.material = new THREE.MeshBasicMaterial( {
    side: THREE.DoubleSide,color: `rgb(${color[i]})` }
  );

  this.mesh = new THREE.Mesh(geometry, this.material);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 0.5);
  this.percent =  i * .008;
  this.burst = burst ? true : false;
  this.offset = new THREE.Vector3(0, 0, 0);
  this.speed = 1;
  this.mesh.rotation.z = Math.PI * 0.845 // i / 30
  this.mesh.rotation.y = Math.PI

  if (!this.burst){
    this.speed *= 0.000001;
    this.mesh.scale.x *= 10.4; // 27.4
    this.mesh.scale.y *= 10.4; // 27.4
  }
  const group = new THREE.Group();
  global.arrForMesh.push(this.mesh)

  scene.add(group)

  var canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  var context = canvas.getContext("2d");
  var x = window.innerWidth / 2 - 300;
  var y = window.innerHeight / 2 - 300;
  context.font = "70px Namastate-Regular"
  context.textAlign = "center";
  context.fillStyle = "#fff";
  context.fillText(text[i], canvas.width / 2, canvas.height / 2);
  this.textMaterial = new THREE.MeshBasicMaterial({
    alphaMap: texture,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 1.4
  })
  this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial)
  this.mesh.add(this.textMesh)

  this.textMesh.name = text[i]

  this.textMesh.position.set(0,-0.6,0.15)
  this.textMesh.rotation.set(0,0,3.65)

  group.add(this.mesh)
  global.arrForGroup.push(group)
  scene.add(group)
}
Particle.prototype.update = function (tunnel, delta) {

  if (global.scrollWhere === "down") {
    this.percent -= (this.speed - 2) * (this.burst ? 1 : tunnel.speed + 1)
  } else if (global.scrollWhere === "top") {
    this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
  }
  // this.mesh.geometry.verticesNeedUpdate = true;
  // this.textMesh.geometry.verticesNeedUpdate = true;

  this.pos = tunnel.curve.getPoint(1 - (this.percent % 1)).add(this.offset)
  global.thisPos = this.pos

  this.mesh.position.x = this.pos.x
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;

}
// All needed textures
var textures = {
  "stone": {
    url: "img/demo1/stonePattern.jpg"
  },
  "stoneBump": {
    url: "img/demo1/stonePatternBump.jpg"
  }
};
// Create a new loader
var loader = new THREE.TextureLoader();
// Prevent crossorigin issue
loader.crossOrigin = "Anonymous";
// Load all textures
for (var name in textures) {
  (function(name) {
  loader.load(textures[name].url, function(texture) {
    textures[name].texture = texture;
    checkTextures();
  });
})(name)
}
var texturesLoaded = 0;
function checkTextures() {
  texturesLoaded++;
  if (texturesLoaded === Object.keys(textures).length) {
    document.body.classList.remove("loading");
    // When all textures are loaded, init the scene
    window.tunnel = new Tunnel();
  }
}
