var kitty = {};

kitty.WIDTH = 720;
kitty.HEIGHT = 600;
kitty.TIME = 120; //seconds

kitty.Game = function(game_canvas, container){
	this.container = container;
	this.canvas = game_canvas;
	this.score = 0;
	this.currentView = null;
	kitty.globgame = this;
};

kitty.Game.prototype.start = function(){
	this.stop();
	this.score = 0;
	var dis = this;
	this.currentView = new kitty.views.StartView(this, function(){
		dis.currentView.stop();
		dis.currentView = new kitty.views.GameView(dis, kitty.TIME * 1000, function(){
			dis.stop();
			dis.currentView = new kitty.views.ScoreView(dis, dis.score, function(){
				dis.stop();
				dis.start();
			});
			dis.currentView.start();
		});
		dis.currentView.start(30, (kitty.TIME * 1000) / (kitty.TIME * 3));
	});
	this.currentView.start();
};

kitty.Game.prototype.stop = function(){
	if(this.currentView != null){
		this.currentView.stop();
	}
};


kitty.Game.prototype.drawScreen = function(name, args, tickDelta){
	kitty.Game.screens[name](this.canvas, args);
};

kitty.Game.screens = {
	"SplashScreen": function(canvas, args){
		canvas.drawRect({
			fillStyle: "black",
			x: 0, y: 0,
			width: kitty.WIDTH,
			height: kitty.HEIGHT,
			fromCenter: false
		});
		
	},
	"ScoreScreen": function(canvas, args){
		canvas.drawRect({
			fillStyle: "black",
			x: 0, y: 0,
			width: kitty.WIDTH,
			height: kitty.HEIGHT,
			fromCenter: false
		});
		canvas.drawText({
			fillStyle: "white",
			fontSize: "20px",
			fontFamily: "Arial",
			x: kitty.WIDTH/2, 
			y: 50,
			text: "Teh Kitty Game",
			fromCenter: true
		});
		canvas.drawText({
			fillStyle: "white",
			fontSize: "30px",
			fontFamily: "Arial",
			x: kitty.WIDTH/2, 
			y: kitty.HEIGHT/2,
			text: args.errorText,
			fromCenter: true
		});
		canvas.drawText({
			fillStyle: "white",
			fontSize: "20px",
			x: kitty.WIDTH/2, y: kitty.HEIGHT/2 + 35,
			text: "You got a score of: " + args.score,
			fromCenter: true
		});
	}
}
