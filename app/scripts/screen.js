var Screen = (function(){
  var renderer = new PIXI.CanvasRenderer(width(), height(), {clearBeforeRender:true});

  function width(){
    return $(window).width();
  }

  function height(){
    return $(window).height();
  }

  function resize(){
    renderer.resize(width(),height());
  }
  return{
    width:width
  , height:height
  , resize:resize
  , renderer:renderer
  };
})();

console.log(Screen);