var CANDLE = (function(){
  var stage = new PIXI.Stage(0xffefef);

  function demo(){
    var candleText = new PIXI.Text('candle.js',{font: '10em Arial', fill:'pink'});
    var loader = new PIXI.AssetLoader();
    CANDLE.stage.addChild(candleText);
    candleText.frame = function(){
      this.setStyle({font: (Screen.width()/100).toFixed(0)+'em Arial', fill:'pink'});
      this.position.x = (Screen.width() - this.width)/2;
      this.position.y = (Screen.height() - this.height)/2;
    };
    candleText.exit = function(){
      console.log('on exit');
      loader.assetURLs = CANDLE.getAssetURLs();
      loader.load();
      loader.onComplete = function(){
        stage.removeChild(candleText);
        stage.setBackgroundColor(0x000000);
        Camera.init();
        CANDLE.emit('START');
      };
      loader.onProgress = function(){
        // console.log(loader.loadCount);
      };
    };
    DS4.once('PAD_1',candleText.exit);
  }


  function play(game){
    _game = game;
    $('body').append(Screen.renderer.view);
    Screen.resize();
    $(window).resize(Screen.resize);
    demo();
    requestAnimFrame( animate );
  }

  function animate() {
    requestAnimFrame( animate );
    stage.onFrame();
    Screen.renderer.render(stage);
  }

  function getAssetURLs(){
    var urls = [];
    for(var i=0;i<110;i++){
      urls.push('images/tiles/tile_'+i+'.png');
    }
    urls.push('images/walls.png');
    return urls;
  }

  r = {
    play:play
  , stage:stage
  , getAssetURLs:getAssetURLs
  };
  PIXI.EventTarget.call(r);
  return r;
})();

console.log(CANDLE);