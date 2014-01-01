if(kitty.views == undefined)
	kitty.views = {};

kitty.MAX_INFO_DELTA = 200;

kitty.rand = function(min, max){
	return Math.round(Math.random() * max) + min;
};

kitty.load = function(images, callback, i) {
	if(i == undefined) i = 0;
	if(i == images.length) callback();
	var img = new Image();
	img.src = images[i];
	img.onload = function(){
		console.log("Loaded: " + img.src + "(" + (i + 1)  + "/" + images.length + ")");
		kitty.load(images, callback, ++i);
	};
}

kitty.Images = ["imgs/suppy.png", "imgs/kappa.png", "imgs/cat2.png", "imgs/cat1.png", "imgs/cat3.png", "imgs/csgo.png", "imgs/lol.png", "imgs/wow.png", "imgs/heart.png","imgs/catbg.png","imgs/space.jpg"];

kitty.EntityType = function(name, points, img, w, h){ this.name = name; this.points = points; this.img = img; this.w = w; this.h = h;};

kitty.EntityTypes = [
	new kitty.EntityType("Suppy", -20, "imgs/suppy.png", 311 * 3/8, 400 * 3/8),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Cat", 3, "imgs/cat3.png", 474 * 1/4, 532 * 1/4),
	new kitty.EntityType("Cat", 3, "imgs/cat3.png", 474 * 1/4, 532 * 1/4),
	new kitty.EntityType("Cat", 2, "imgs/cat2.png", 200 * 1/2, 336 * 1/2),
	new kitty.EntityType("Cat", 2, "imgs/cat2.png", 200 * 1/2, 336 * 1/2),
	new kitty.EntityType("Cat", 2, "imgs/cat2.png", 200 * 1/2, 336 * 1/2),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("CS:GO", 8, "imgs/csgo.png", 512 * 1/4, 512 * 1/4),
	new kitty.EntityType("CS:GO", 8, "imgs/csgo.png", 512 * 1/4, 512 * 1/4),
	new kitty.EntityType("CS:GO", 8, "imgs/csgo.png", 512 * 1/4, 512 * 1/4),
	new kitty.EntityType("WoW", 10, "imgs/wow.png", 512 * 1/4, 509 * 1/4),
	new kitty.EntityType("LoL", 20, "imgs/lol.png", 512 * 1/4, 512 * 1/4)
];

kitty.Entity = function(pos, v, uid, type, canvas){
	this.pos = pos;
	this.v = v;
	this.uid = uid;
	this.name = type.name;
	this.points = type.points;
	this.w = type.w;
	this.h = type.h;
	this.estr = "enitity_" + uid;
 	this.canvas = canvas;
	this.canvas.addLayer({
		name: this.estr,
		type: "image",
		source: type.img,
		width: type.w,
		height: type.h,
		x: this.pos.x, y: this.pos.y,
		fromCenter: true
	});
	this.layer = canvas.getLayer(this.estr);
};

kitty.Entity.prototype.update = function(delta){
	this.pos.x += this.v.x * delta;
	this.pos.y += this.v.y * delta ;
	this.canvas.setLayer(this.layer, {
		x: this.pos.x,
		y: this.pos.y
	});
};

kitty.Entity.prototype.destroy = function(){
	this.canvas.removeLayer(this.estr);
};

kitty.views.View = function(canvas) { this.canvas = canvas; };
kitty.views.View.prototype.render = function(){};
kitty.views.View.prototype.start = function(){};
kitty.views.View.prototype.stop = function(){};


kitty.views.ScoreView = function(game, score, cb){
	this.game = game;
	this.canvas = game.canvas;
	this.cb = cb;
	this.score = score;
	this.canvas.addLayer({
		name: "text",
		type: "text",
		text: "Press [ENTER] to go to the menu!",
		fillStyle: "yellow",
		strokeStyle: "black",
		strokeWidth: 1,
		fontSize: 5,
		align: "left",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT - 80,
		fromCenter: true
	});
	this.textLayer = this.canvas.getLayer("text");
	this.animateText(this.textLayer, 28, 30, 200);
	$(window).keydown(function(e){
		if(e.keyCode == 13) cb();
		e.preventDefault();
	})
};

kitty.views.ScoreView.prototype = new kitty.views.View();
kitty.views.ScoreView.constructor = kitty.views.ScoreView;

kitty.views.ScoreView.prototype.animateText = function(layer, min, max, time){
	var dis = this;
	dis.canvas.animateLayer(layer, {
		fontSize: max,
		strokeWidth: 1
	}, time, function(layer){
		dis.canvas.animateLayer(layer, {
			fontSize: min,
			strokeWidth: 0.1	
		}, time, function(layer){ dis.animateText(layer, min, max, time); });
	});
};

kitty.views.ScoreView.prototype.start = function(delta){
	this.doRender = true;
	var dis = this;
	var prev = new Date();
	var renderer = function(){
		if(dis.doRender){
			try{
				dis.render(Math.abs((new Date()) - prev));
				prev = new Date();
			}catch(e){
				console.error(e);
			}
			setTimeout(renderer, delta);
		}
	};
	renderer();
	
};

kitty.views.ScoreView.prototype.render = function(){
	this.canvas.clearCanvas();
	this.canvas.drawImage({
		source: "imgs/catbg.png",
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.drawText({
		fillStyle: "black",
		fontSize: "50px",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT/2 + 30,
		text: "You got " + this.score + " points!",
		fromCenter: true
	});
	this.canvas.drawText({
		fillStyle: this.score > 300 ? "yellow" : "red",
		fontSize: "40px",
		x: 100, 
		y: 200,
		text: this.score > 300 ? "Well done! :D" : "You can do better! :(",
		fromCenter: false,
		rotate: 30
	});
	this.canvas.drawLayer(this.textLayer);
};

kitty.views.ScoreView.prototype.stop = function(){
	this.doRender = false;
	this.canvas.removeLayers();
	$(window).unbind("keydown");
};



kitty.views.StartView = function(game, cb){
	this.game = game;
	this.canvas = game.canvas;
	this.cb = cb;
	this.defText = "Press [ENTER] to start!";
	this.canvas.addLayer({
		name: "text",
		type: "text",
		text: this.defText,
		fillStyle: "yellow",
		strokeStyle: "black",
		strokeWidth: 1,
		fontSize: 5,
		align: "left",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT - 80,
		fromCenter: true
	});
	this.canvas.addLayer({
		name: "hello",
		type: "text",
		text: "Happy 2014 Kitty!",
		fillStyle: "blue",
		strokeStyle: "black",
		strokeWidth: 1,
		fontSize: 20,
		align: "left",
		x: 130,
		y: 130,
		rotate: -45,
		fromCenter: true
	});
	this.textLayer = this.canvas.getLayer("text");
	this.helloLayer = this.canvas.getLayer("hello");
	this.animateText(this.textLayer, 28, 30, 200);
	this.animateText(this.helloLayer, 20, 40, 1000);
	var dis = this;
	this.loaded = false;
	kitty.load(kitty.Images, function(){
		dis.loaded = true;
	});
	$(window).keydown(function(e){
		if(e.keyCode == 13 && dis.loaded) cb();
		e.preventDefault();
	});
}

kitty.views.StartView.prototype = new kitty.views.View();
kitty.views.StartView.constructor = kitty.views.StartView;

kitty.views.StartView.prototype.animateText = function(layer, min, max, time){
	var dis = this;
	dis.canvas.animateLayer(layer, {
		fontSize: max,
		strokeWidth: 1
	}, time, function(layer){
		dis.canvas.animateLayer(layer, {
			fontSize: min,
			strokeWidth: 0.1	
		}, time, function(layer){ dis.animateText(layer, min, max, time); });
	});
};

kitty.views.StartView.prototype.start = function(delta){
	this.doRender = true;
	var dis = this;
	var prev = new Date();
	var renderer = function(){
		if(dis.doRender){
			try{
				dis.render(Math.abs((new Date()) - prev));
				prev = new Date();
			}catch(e){
				console.error(e);
			}
			setTimeout(renderer, delta);
		}
	};
	renderer();
	
};

kitty.views.StartView.prototype.render = function(){
	this.canvas.clearCanvas();
	this.canvas.drawImage({
		source: "imgs/catbg.png", 
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.drawText({
		fillStyle: "black",
		fontSize: "50px",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT/2 + 30,
		text: "The Kitty Game",
		fromCenter: true
	});
	this.canvas.drawText({
		fillStyle: "black",
		fontSize: "10px",
		fontStyle: "bold",
		x: kitty.WIDTH/2, y: kitty.HEIGHT/2 + 65,
		text: "Written by J4x0 <3",
		fromCenter: true
	});
	if(!this.loaded){
		this.canvas.setLayer(this.textLayer, {
			text: "Loading shit.. Please wait"
		});
	}else { 
		this.canvas.setLayer(this.textLayer, {
			text: this.defText
		});
	}
	this.canvas.drawLayer(this.textLayer);
	this.canvas.drawLayer(this.helloLayer);
};

kitty.views.StartView.prototype.stop = function(){
	this.doRender = false;
	this.canvas.removeLayers();
	$(window).unbind("keydown");
};

kitty.views.GameView = function(game, maxTime, cb){
	this.game = game;
	this.canvas = game.canvas;
	this.maxTime = maxTime;
	this.cb = cb;
	this.canvas.addLayer({
		name: "overlay",
		type: "rectangle",
		visible: false,
		x: 0, y: 0,
		width: kitty.WIDTH, height: kitty.HEIGHT,
		fromCenter: false
	});
	this.canvas.addLayer({
		name: "target",
		type: "arc",
		strokeStyle: "white",
		strokeWidth: 2,
		x: kitty.WIDTH / 2, y: kitty.HEIGHT / 2,
		start: 0,
		end: 360,
		radius: 20,
		fromCenter: true
	});
	this.canvas.addLayer({
		name: "target_img",
		type: "image",
		source: "imgs/heart.png",
		width: 30, height: 30,
		fromCenter: true,
		x: kitty.WIDTH / 2, y: kitty.HEIGHT / 2
	});
	this.canvas.addLayer({
		name: "info",
		type: "text",
		strokeStyle: "yellow",
		text: "",
		fontSize: 25,
		strokeWidth: 1,
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.addLayer({
		name: "box",
		type: "rectangle",
		fillStyle: "white",
		width: 140, height: 50,
		fontSize: 20,
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.addLayer({
		name: "box_text",
		type: "text",
		text: "",
		fillStyle: "black",
		fontSize: "20px",
		align: "left",
		x: 0, y: 5,
		maxWidth: 140,
		fromCenter: false
	});
	this.overLayer = this.canvas.getLayer("overlay");
	this.targetLayer = this.canvas.getLayer("target");
	this.targetImgLayer = this.canvas.getLayer("target_img");
	this.infoLayer = this.canvas.getLayer("info");
	this.boxLayer = this.canvas.getLayer("box");
	this.boxTextLayer = this.canvas.getLayer("box_text");
	this.infoDelta = 0;
	this.overlayId = 0;
	this.mousePos = this.mouseTilePos = {x: 0, y: 0};
	this.entities = [];
	this.time = 0;
	this.addEntity();
};

kitty.views.GameView.prototype = new kitty.views.View();
kitty.views.GameView.constructor = kitty.views.GameView;

kitty.views.GameView.prototype.hit = function() {
	var mouse = this.mousePos;
	var ind = null;
	for(var i = this.entities.length - 1; i > -1; --i){
		var ent = this.entities[i];
		var sx = ent.pos.x - ent.w / 2;
		var sy = ent.pos.y - ent.h / 2;
		if(mouse.x >= sx && mouse.y >= sy && mouse.x <= sx + ent.w && mouse.y <= sy + ent.h){
			ent.destroy();
			this.game.score += ent.points;
			if(ent.points > 0)
				this.displayInfo(ent.name + " +" + ent.points + " :D");
			else{ 
				this.displayInfo(ent.name + " -" + Math.abs(ent.points) + " :(");
				this.setOverlay([255, 0, 0], 70);
			}
			ind = i;
			break;
		}
	}
	if(ind != null){
		this.entities.splice(i, 1);
		if(Math.random() < 0.15) this.addEntity();
	} 
}

kitty.views.GameView.prototype.setOverlay = function(color, time){
	var colorStr = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 0.3)";
	var id = this.overlayId = Math.random();
	this.canvas.setLayer(this.overLayer, {
		fillStyle: colorStr,
		visible: true
	});
	var dis = this;
	setTimeout(function(){
		if(dis.overlayId == id) 
			dis.canvas.setLayer(dis.overLayer, {
				visible: false
			});
	}, time);
}

kitty.views.GameView.prototype.displayInfo = function(txt){
	this.infoDelta = 0;
	this.canvas.setLayer(this.infoLayer, {
		text: txt
	});
};

kitty.views.GameView.prototype.addEntity = function(){
	var randI = kitty.rand(0, kitty.EntityTypes.length - 1);
	var type = kitty.EntityTypes[randI];
	var speedup = 1 + this.game.score / 400;
	if(type.points > 5) speedup += (type.points - 5) / 5 - (speedup - 1) / 4;
	var uid = kitty.rand(0, 1000);
	var randPos = {x: kitty.rand(90, kitty.WIDTH - 90), y: kitty.rand(90, kitty.HEIGHT - 90)};
	var randV = {x:0,y:0};
	if(randPos.x > kitty.WIDTH * 3/4 || Math.random() < 0.5) randV.x = kitty.rand(-0.2, -0.3); 
	else randV.x = kitty.rand(0.2, 0.3);
	if(randPos.y > kitty.HEIGHT * 3/4 || Math.random() < 0.5) randV.y = kitty.rand(-0.2, -0.3); 
	else randV.y = kitty.rand(0.2, 0.3);
	randV.x = randV.x * speedup; randV.y = randV.y * speedup;
	var entity = new kitty.Entity(randPos, randV, uid.toString(), type, this.canvas);
	this.entities.push(entity);
};

kitty.views.GameView.prototype.start = function(rdelta, amaxdelta){
	this.doRender = true;
	var dis = this;
	var prev = new Date();
	var renderer = function(){
		if(dis.doRender){
			try{
				dis.render(Math.abs((new Date()) - prev));
				prev = new Date();
			}catch(e){
				console.error(e);
			}
			setTimeout(renderer, rdelta);
		}
	};
	this.doAdd = true;
	var adder = function(){
		try{
			dis.addEntity();
		}catch(e){
			console.error(e);
		}
		if(dis.doAdd)
			setTimeout(adder, kitty.rand(amaxdelta / 2, amaxdelta));
	};
	this.canvas.mousemove(function(e){
		dis.mousePos = {
			x: e.pageX - $(this).offset().left,
			y: e.pageY - $(this).offset().top
		};
	});
	this.canvas.click(function(e){
		try{
			dis.hit();
		}catch(e){console.error(e);}
	});
	renderer();
	adder();
};

kitty.views.GameView.prototype.stop = function(){
	this.doAdd = false;
	this.doRender = false;
	this.canvas.unbind("mousemove");
	this.canvas.unbind("click");
	this.canvas.removeLayers();
};

kitty.views.GameView.prototype.removeEnts = function(delIs){
	for(var i = 0; i < delIs.length; ++i){ 
		var index = delIs[i] - i;
		this.entities[index].destroy();
		this.entities.splice(index, 1); 
	}
}

kitty.views.GameView.prototype.render = function(delta){
	this.time += delta;
	this.canvas.clearCanvas();
	this.canvas.drawImage({
		source: "imgs/space.jpg", 
		x: 0, y: 0,
		height: kitty.HEIGHT, width: 858 * (kitty.HEIGHT/ 536),
		fromCenter: false
	});
	if(this.infoDelta >= kitty.MAX_INFO_DELTA) this.displayInfo("");
	this.infoDelta += delta;
	
	var delIs = [];
	for(var i = 0; i < this.entities.length; ++i){
		var ent = this.entities[i];
		ent.update(delta);
		this.canvas.drawLayer(ent.layer);
		if(ent.pos.x >= kitty.WIDTH || ent.pos.y >= kitty.HEIGHT) delIs.push(i); 
	}
	this.removeEnts(delIs);
	this.canvas.setLayer(this.targetLayer, {
		x: this.mousePos.x,
		y: this.mousePos.y
	});
	this.canvas.setLayer(this.targetImgLayer, {
		x: this.mousePos.x,
		y: this.mousePos.y
	});
	this.canvas.setLayer(this.infoLayer, {
		x: this.mousePos.x,
		y: this.mousePos.y - 50
	});
	this.canvas.setLayer(this.boxTextLayer,{
		text: "Progress: " + Math.round((this.time / this.maxTime) * 100) + "%\n" +
			  "Score: " + this.game.score
	});
	this.canvas.drawLayer(this.targetImgLayer);
	this.canvas.drawLayer(this.targetLayer);
	this.canvas.drawLayer(this.infoLayer);
	this.canvas.drawLayer(this.overLayer);
	this.canvas.drawLayer(this.boxLayer);
	this.canvas.drawLayer(this.boxTextLayer);
	if(this.time >= this.maxTime){
		this.cb();
	}
};
