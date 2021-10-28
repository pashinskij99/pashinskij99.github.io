var Apps = function () {
    var container, stats;

    var camera, scene, renderer;
    var group;

    var targetRotation = 5.2;
    var targetRotationOnMouseDown = 0;

    var exporter = new THREE.STLExporter();

    var mouseX = 0;
    var mouseXOnMouseDown = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var controls, translBlock = 'back', dftMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        shading: THREE.SmoothShading,
        opacity: 1,
        emissive: 0x8F8F8F,
        color: 0xFFFFFF
        //lightMap: texture
    }), varlastMater, lastMater, texture1, metal, lastFon, fon = [], countOfPoints = 20,points=false;


    const text = THREE.ImageUtils.loadTexture('img/metal1.jpg', false, function (vg) {
        texture1 = vg;
        texture1.wrapS = texture1.wrapT = THREE.ClampToEdgeWrapping;
        texture1.format = THREE.RGBFormat;
        texture1.repeat.set(0.82, 0.82);
        texture1.offset.set(0.14, 0.14);

        metal = new THREE.MeshPhongMaterial({
            //color: "#CA6500",
            shininess: 30,
            //emissive: '#4A2500',
            shading: THREE.SmoothShading,
            vertexColors: false,
            blending:     THREE.AdditiveBlending,
            //envMap: vg,
            map: vg,
            reflectivity: 0.05,
            bumpMap: texture1,
            bumpScale: 8.92,
            //specular: "#000000",
            side: THREE.DoubleSide
        });
        fon[0] = new Image();
        fon[0].src = 'img/FON_1.jpg';
        fon[0].onload = function () {
            fon[1] = new Image();
            fon[1].src = 'img/FON_2.jpg';
            fon[1].onload = function () {
                fon[2] = new Image();
                fon[2].src = 'img/FON_3.jpg';
                fon[2].onload = function () {
                    lastFon = fon[0];
                    document.getElementById('main').appendChild(lastFon);
                    init();
                    animate();
                    guiObj.init();
                }
            }
        }
    });

    text.minFilter = THREE.NearestFilter

    var path = "img/textures/skybox/gray/";
    var format = '.jpg';
    var urls = [path + 'posx' + format, path + 'negx' + format, path + 'posy' + format, path + 'negy' + format, path + 'posz' + format, path + 'negz' + format];
    //var textureCube = THREE.ImageUtils.loadTextureCube(urls);
    //textureCube.format = THREE.RGBFormat;
    var guiObj = {
        gui: '',
        init: function () {
            var renderObj = {
                isOnchange: false,
                color: 0xa9b3b3,
                radious: 3,
                countPoints: 20,
                val: null,
                genereateCounts: function () {
                    // console.log('this.val', this.val)
                    generateCurve(true, this.val);
                },
                exportStl: function () {
                    exportModel();
                },
                changeSize: function () {
                    // exportModel();
                },
                genereate: function () {
                    generateCurve(true);
                },
                changeBack: function () {

                }, changeTexture: function () {

                }
            }
            this.gui = new dat.GUI({width: 280});
            this.gui.add(renderObj, 'genereateCounts').name('Make a' +
                ' sculpture')
            this.gui.add(renderObj, 'exportStl').name('Export');
            // this.gui.add(renderObj, 'changeSize').min(1).max(50).name('Size').onChange(function (val) {
            //     console.log(val);
            // });
            //this.gui.add(renderObj, 'genereate').name('Generate New Curve');
            //this.gui.add(renderObj, 'countPoints').min(4).max(50).name('Count of Points').onChange(function (val) {
            //    countOfPoints = val;
            //});
            this.gui.add(renderObj, 'radious').min(1).max(10).name('Size').onChange((val) => {
               generateCurve(false, val, val);
               renderObj.val = val
            });
            //this.gui.addColor(renderObj, 'color').name('Color').onChange(function (val) {
            //    for (var i = 0; i < group.children.length; i++) {
            //        group.children[i].material.color = new THREE.Color(val);
            //    }
            //});
            this.gui.add(renderObj, 'changeBack', ['plastic', 'metal']).name('Change Texture').onChange(function (val) {
                changeTexture(val);
            });
            this.gui.add(renderObj, 'changeBack', ['Room I', 'Room II', 'Room III']).name('Change Background').onChange(function (val) {
                document.getElementById('main').removeChild(lastFon);
                var curI;
                switch (val) {
                    case 'Room I':
                        curI = fon[0];
                        break;
                    case 'Room II':
                        curI = fon[1];
                        break;
                    case 'Room III':
                        curI = fon[2];
                        break;
                }
                lastFon = curI;
                document.getElementById('main').appendChild(curI);
                //$('#'+translBlock).css('background-image',"url(http://webgl.unilimes.com/project/curve3D/img/"+val+".jpg)");
            });
        }
    }


    function init() {

        //container = document.createElement('div');
        container = document.getElementById(translBlock);
        //document.body.appendChild(container);

        /*var info = document.createElement('div');
         info.style.position = 'absolute';
         info.style.top = '30px';
         info.style.width = '100%';
         info.style.textAlign = 'center';
         info.innerHTML = 'Drag to spin';
         container.appendChild(info);*/

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 50000);
        camera.position.set(810, 100, 0);


        scene = new THREE.Scene();
        //scene.add(new THREE.AxisHelper(100));
        camera.rotation.x = 1.61;
        camera.rotation.y = 1.55;
        camera.rotation.z = -1.57;

        /*
         * lights
         * */

        var ambiLight = new THREE.AmbientLight(0x111111);
        scene.add(ambiLight);
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(300, 1000, 100);
        spotLight.target.position.set(0, 0, 0).normalize();
        spotLight.shadowCameraNear = 0.91;
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.25;
        spotLight.intensity = 0.99;
        spotLight.shadowCameraVisible = false;
        scene.add(spotLight);

        generateCurve(true);
        //start!!!
        //group = new THREE.Mesh(new THREE.CubeGeometry(10,10,10),metal);
        //group.castShadow = true;
        //group.scale.multiplyScalar(30);
        //scene.add(group);

        /*
         * floor
         * */
        var geometry = new THREE.BoxGeometry(5, 10, 0.2);
        THREE.ShaderLib["basic"].fragmentShader = basicFragmentShader(false);
        var material = new THREE.MeshBasicMaterial();
        var ground = new THREE.Mesh(geometry, material);
        ground.scale.multiplyScalar(250);
        ground.position.y = -200;
        ground.position.x = -50;
        ground.rotation.x = Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        renderer = new THREE.WebGLRenderer({
            antialias: true, alpha: true
        });
        renderer.autoClear = false;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;
        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;

        container.appendChild(renderer.domElement);

        //stats = new Stats();
        //stats.domElement.style.position = 'absolute';
        //stats.domElement.style.top = '0px';
        //container.appendChild(stats.domElement);

        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
        renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);

        window.addEventListener('resize', onWindowResize, false);

        $('.container-loader').fadeOut();

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function generateCurve(flag, size, val ) {
        if (group)scene.remove(group);
        group = new THREE.Group();
        scene.add(group);

        var nurbsControlPoints = [];
        var nurbsKnots = [];
        var nurbsDegree = 3;

        for (var i = 0; i <= nurbsDegree; i++) {

            nurbsKnots.push(0);

        }

        let count = 0, max = 6, min = 5;
        if (flag) {
            count = Math.round(Math.random() * (max - min) + min)
        } else {
            count = countOfPoints;
        }
        for (var i = 0, j = count; i < j; i++) {
            var vector = new THREE.Vector4(
                Math.random() * 400 - 200,
                Math.random() * 400,
                Math.random() * 400 - 200,
                1 // weight of control point: higher means stronger attraction
            );
            //vector.lerp();
            nurbsControlPoints.push(vector);

            var knot = ( i + 1 ) / ( j - nurbsDegree );
            nurbsKnots.push(THREE.Math.clamp(knot, -1, 1));

        }

        nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

        points = (points && val ) ? points : nurbsCurve.getPoints(100);

        var spline = new THREE.SplineCurve3(points);

        var texture = THREE.ImageUtils.loadTexture('img/plastic.jpg');
        texture.wrapT = THREE.RepeatWrapping;
        var nurbsMaterial = lastMater ? lastMater : dftMaterial;
        var rad = size ? size : 3;
        var geometry = new THREE.TubeGeometry(spline, 1100, rad, 30);
        nurbsLine = new THREE.Mesh(geometry, nurbsMaterial);
        nurbsLine.category = 'changes';

        var p = spline.points;
        var f = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 10), nurbsMaterial);
        f.position.x = p[0].x;
        f.position.y = p[0].y - 100;
        f.position.z = p[0].z;
        f.category = 'changes';
        var s = f.clone();
        s.position.x = (p[p.length - 1]).x;
        s.position.y = (p[p.length - 1]).y - 100;
        s.position.z = (p[p.length - 1]).z;
        group.add(f);
        group.add(s);

        nurbsLine.position.set(0, -100, 0);
        nurbsLine.castShadow = true;
        var nurbsControlPointsGeometry = new THREE.Geometry();
        nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
        var nurbsControlPointsMaterial = new THREE.LineBasicMaterial({linewidth: 2, color: 0xffffff, opacity: 0.25});

        var nurbsControlPointsLine = new THREE.Line(nurbsControlPointsGeometry, nurbsControlPointsMaterial);
        nurbsControlPointsLine.position.copy(nurbsLine.position);
        group.add(nurbsLine);
    }

    function exportModel(){
        setTimeout(()=>{

            let res = exporter.parse( nurbsLine );

            var a = document.getElementById('downloadAnchorElem');


            var dataStr = JSON.stringify(res);
            var blob = new Blob([dataStr], {type: "octet/stream"});
            var url = window.URL.createObjectURL(blob);

            a.href = url;
            a.download = 'sculpture.stl';
            a.click();
            window.URL.revokeObjectURL(url);

        }, 100)
    }

    function onDocumentMouseDown(event) {

        event.preventDefault();
        /*if(event.clientX > 1350 && event.clientY < 105){
         return;
         }*/
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);

        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;

    }

    function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;

        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
    }

    function onDocumentMouseUp(event) {

        renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);

    }

    function onDocumentMouseOut(event) {

        renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);

    }

    function onDocumentTouchStart(event) {

        if (event.touches.length == 1) {

            event.preventDefault();

            mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
            targetRotationOnMouseDown = targetRotation;

        }

    }

    function onDocumentTouchMove(event) {

        if (event.touches.length == 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

        }

    }

    function animate() {
        requestAnimationFrame(animate);
        //controls.update();
        render();
        //stats.update();

    }

    function render() {
        group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
        camera.updateMatrixWorld();
        renderer.clear();
        renderer.render(scene, camera);

    }

    function basicFragmentShader(state) {
        return [
            "uniform vec3 diffuse;",
            "uniform float opacity;",

            THREE.ShaderChunk["common"],
            THREE.ShaderChunk["color_pars_fragment"],
            THREE.ShaderChunk["map_pars_fragment"],
            THREE.ShaderChunk["alphamap_pars_fragment"],
            THREE.ShaderChunk["lightmap_pars_fragment"],
            THREE.ShaderChunk["envmap_pars_fragment"],
            THREE.ShaderChunk["fog_pars_fragment"],
            THREE.ShaderChunk["shadowmap_pars_fragment"],
            THREE.ShaderChunk["specularmap_pars_fragment"],
            THREE.ShaderChunk["logdepthbuf_pars_fragment"],

            "void main() {",

            "	vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
            "	vec4 diffuseColor = vec4( diffuse, opacity );",

            THREE.ShaderChunk["logdepthbuf_fragment"],
            THREE.ShaderChunk["map_fragment"],
            THREE.ShaderChunk["color_fragment"],
            THREE.ShaderChunk["alphamap_fragment"],
            THREE.ShaderChunk["alphatest_fragment"],
            THREE.ShaderChunk["specularmap_fragment"],

            "	outgoingLight = diffuseColor.rgb;", // simple shader

            THREE.ShaderChunk["lightmap_fragment"],		// TODO: Light map on an otherwise unlit surface doesn't make sense.
            THREE.ShaderChunk["envmap_fragment"],
            THREE.ShaderChunk["shadowmap_fragment"],		// TODO: Shadows on an otherwise unlit surface doesn't make sense.

            THREE.ShaderChunk["linear_to_gamma_fragment"],

            THREE.ShaderChunk["fog_fragment"],

            (state === false) ? "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 - shadowColor.x );" : "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

            "}"
        ].join("\n");
    }

    function changeTexture(val) {
        var material;
        switch (val) {
            case 'metal':
                material = metal;
                break;
            default :
                material = dftMaterial;
        }
        material.needsUpdate = true;
        lastMater = material;
        for (var i = 0; i < group.children.length; i++) {
            group.children[i].material = material;
        }
    }

    /*App.types = {
     skyBox: '',
     urlImg: 'img/',
     backgroundContainer: ''
     }
     App.rebuildSkyBox = {
     changeBackground: function (id) {
     var imagePrefix, skyBox = App.types.skyBox, playVideoBack = App.types.backgroundContainer;
     switch (id) {
     case 'mountain':
     imagePrefix = ['dawnmountain-xpos.png', 'dawnmountain-xneg.png', 'dawnmountain-ypos.png',
     'dawnmountain-yneg.png', 'dawnmountain-zpos.png', 'dawnmountain-zneg.png'];
     break;
     case 'siege':
     imagePrefix = ['siege_ft.png', 'siege_bk.png', 'siege_up.png',
     'siege_dn.png', 'siege_rt.png', 'siege_lf.png'];
     break;
     case 'starfield':
     imagePrefix = ['starfield_ft.png', 'starfield_bk.png', 'starfield_up.png',
     'starfield_dn.png', 'starfield_rt.png', 'starfield_lf.png'];
     break;
     case 'misty':
     imagePrefix = ['misty_ft.png', 'misty_bk.png', 'misty_up.png',
     'misty_dn.png', 'misty_rt.png', 'misty_lf.png'];
     break;
     case 'tidepool':
     imagePrefix = ['tidepool_ft.png', 'tidepool_bk.png', 'tidepool_up.png',
     'tidepool_dn.png', 'tidepool_rt.png', 'tidepool_lf.png'];
     break;

     }
     var materialArray = [];
     for (var i = 0; i < 6; i++) {
     var matr = new THREE.MeshBasicMaterial({
     map: THREE.ImageUtils.loadTexture(App.types.urlImg + imagePrefix[i]),
     side: THREE.BackSide
     });
     materialArray.push(matr);
     }
     skyBox.material = new THREE.MeshFaceMaterial(materialArray);
     },//add background
     add: function () {
     var imagePrefix = ['dawnmountain-xpos.png', 'dawnmountain-xneg.png', 'dawnmountain-ypos.png',
     'dawnmountain-yneg.png', 'dawnmountain-zpos.png', 'dawnmountain-zneg.png'], materialArray = [],
     skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000), skyBox;
     for (var i = 0; i < 6; i++)
     materialArray.push(new THREE.MeshBasicMaterial({
     map: THREE.ImageUtils.loadTexture(App.types.urlImg + imagePrefix[i]),
     side: THREE.DoubleSide
     }));
     skyBox = new THREE.Mesh(skyGeometry, new THREE.MeshFaceMaterial(materialArray));
     scene.add(skyBox);
     App.types.skyBox = skyBox;
     }//add background
     };//settings for background*/
}
$(document).ready(function () {
    new Apps();
    //App.rebuildSkyBox.add();
});
