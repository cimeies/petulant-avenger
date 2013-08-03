var engine = (function () {
	this.state = {
		//this guy here represents the internal status of our 3d engine omg
		interval: 0
	};

	var that = this;

	var setup_for_render = function () {
		that.state.scene = new THREE.Scene();
		that.state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		console.log(that.state.camera);

		that.state.renderer = new THREE.WebGLRenderer();
		that.state.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(that.state.renderer.domElement);
	};

	var setup_for_geometry = function () {
		that.state.camera.position.z = 333;

		that.state.geometries = {}; //represents the internal geometries of all the stuff on the page duude
		that.state.shapes = {}; //so generic...this holds all the geometries bound with meshes

		generate_torus({ 
			color: 0xff0000, 
			wireframe: false,
			geometry: {
				radius: 111,
				tube_diameter: 42,
				radial_segments: 23,
				tubular_segments: 23,
				arc: (Math.PI * 2)
			}
		});
	};

	var generate_pentagram = function (canvas, size, radius) {
		var rotation = Math.PI/2;	
		canvas.beginPath();
		for (var i = 0; i <= (4 * Math.PI); i += ((4 * Math.PI) / 5)) {
			var x = size + radius * Math.cos(i + rotation);
			var y = size + radius * Math.sin(i + rotation);
			canvas.lineTo(x, y);
		}
	};

	var generate_torus = function (opts) {
		that.state.material = new THREE.MeshBasicMaterial({ color: opts.color, wireframe: opts.wireframe });

		var g = opts.geometry;
		that.state.geometries.torus_geometry = new THREE.TorusGeometry(g.radius, g.tube_diameter, g.radial_segments, g.tubular_segments, g.arc);

		var torus_geometry = that.state.geometries.torus_geometry;
		that.state.shapes.torus = new THREE.Mesh(torus_geometry, that.state.material);
		that.state.scene.add(this.state.shapes['torus']);
	};

	var render = function () {
		requestAnimationFrame(render);
		var torus = this.state.shapes.torus;
		torus.geometry.dynamic = true;
		torus.geometry.normalsNeedUpdate = true;
		if (that.state.interval > 10000) {
			that.state.interval = 0;	
		}
		that.state.interval += 1;
		if (that.state.interval % 50 == 0) {
			torus.material.color.r = Math.random();
			torus.material.color.g = Math.random();
			torus.material.color.b = Math.random();
		}
		//torus.rotation.y += 0.01;
		torus.rotation.x += 0.01;
		that.state.renderer.render(that.state.scene, that.state.camera);
		//generate_pentagram(document.getElementsByTagName('canvas')[0].getContext(), 50, 30);
	};

	var turn_key = function () {
		setup_for_render();
		setup_for_geometry();
		render();
	};

	return {
		turn_key: turn_key
	};
})();

$(document).ready(function () {
	engine.turn_key();
});
