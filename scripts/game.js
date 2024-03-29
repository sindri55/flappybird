
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */


		
	var soundsPlaying = new Audio("sounds/nyan.mp3");
	var soundsGameOver = new Audio("sounds/gameover.mp3");
	var soundsCollision = new Audio("sounds/pipe.mp3");

	
    $('.mute').click(function(){ 
        soundsPlaying.pause();
    });

	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.isPlaying = false;
		this.gameObjects = [];

		var obs = new window.Pipes(this.el.find('.Pipes1U'), this.el.find('.Pipes3N'), this, 100);
		this.gameObjects.push(obs);
		var obs2 = new window.Pipes(this.el.find('.Pipes2U'), this.el.find('.Pipes4N'), this, 110);
		this.gameObjects.push(obs2);
		console.log("here " + this.gameObjects.obs);
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {

		if(this.isPlaying == true){
			soundsPlaying.play();
		}
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		this.player.onFrame(delta);
		// Update game entities.
		for(var i = 0; i < this.gameObjects.length; i++)
		{
			this.gameObjects[i].onFrame(delta);	
			this.gameObjects[i].checkCollisionWithBounds(this.player);
		}

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		for(var i = 0; i < this.gameObjects.length; i++)
		{
			this.gameObjects[i].reset();	
		}
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		soundsPlaying.pause();
		soundsCollision.play();
		this.isPlaying = false;

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


