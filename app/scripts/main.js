PIXI.DisplayObjectContainer.prototype.frame = function(){};
PIXI.DisplayObject.prototype.frame = function(){};

PIXI.DisplayObjectContainer.prototype.onFrame = function()
{
  PIXI.DisplayObject.prototype.onFrame.call( this );

  for(var i=0,j=this.children.length; i<j; i++)
  {
    this.children[i].onFrame();
  }
};

PIXI.DisplayObject.prototype.onFrame = function()
{
  this.frame();
};

PIXI.CanvasRenderer.prototype.render = function(stage)
{
	stage.updateTransform();

	this.context.setTransform(1,0,0,1,0,0);

	this.context.globalAlpha = 1;

	this.renderSession.currentBlendMode = PIXI.blendModes.NORMAL;
	this.context.globalCompositeOperation = PIXI.blendModesCanvas[PIXI.blendModes.NORMAL];

	if (navigator.isCocoonJS && this.view.screencanvas) {
		this.context.fillStyle = 'black';
		this.context.clear();
	}

	if (this.clearBeforeRender)
	{
		if (this.transparent)
		{
			this.context.clearRect(0, 0, this.width, this.height);
		}
		else
		{
			this.context.fillStyle = stage.backgroundColorString;
			this.context.fillRect(0, 0, this.width , this.height);
		}
	}

	Camera.frame();
	this.renderDisplayObject(stage);


	// run interaction!
	if(stage.interactive)
	{
	//need to add some events!
		if(!stage._interactiveEventsAdded)
		{
			stage._interactiveEventsAdded = true;
			stage.interactionManager.setTarget(this);
		}
	}
};
CANDLE.play(Wolf);

