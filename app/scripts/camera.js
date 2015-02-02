var Camera = (function(){
  var PI_2 = 2 * Math.PI;
  var posX = 22;
  var posY = 12;
  var dirX = -1;
  var dirY = 0;
  var planeX = 0;
  var planeY = 0.66;
  var time = 0;
  var oldTime = 0;
  var _moveSpeed = 5;
  var _rotSpeed = 2;
  var off = true;
  var c = Screen.renderer.view;
  var ctx = c.getContext('2d');
  var tiles = [];
  var texWidth = 64;
  var texHeight = 64;
  var pixel = 2;

  function init(){
    off = false;
    for(var i=0;i<110;i++){
      tiles[i]=PIXI.BaseTextureCache['images/tiles/tile_'+i+'.png'].source;
    }
  }

  function castRays(){
    w = Screen.width();
    h = Screen.height();
    for(var x = 0;x<w;x+=pixel){
      var cameraX = 2 * x / w - 1;
      var rayPosX = posX;
      var rayPosY = posY;
      var rayDirX = dirX + planeX * cameraX;
      var rayDirY = dirY + planeY * cameraX;
      var mapX = Math.floor(rayPosX);
      var mapY = Math.floor(rayPosY);

      var sideDistX;
      var sideDistY;

      var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY)/(rayDirX * rayDirX));
      var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX)/(rayDirY * rayDirY));
      var perpWallDist;

      var stepX;
      var stepY;

      var hit = 0;
      var side;

      if(rayDirX < 0){
        stepX = -1;
        sideDistX = (rayPosX - mapX) * deltaDistX;
      }else{
        stepX = 1;
        sideDistX = (mapX + 1 - rayPosX) * deltaDistX;
      }
      if(rayDirY < 0){
        stepY = -1;
        sideDistY = (rayPosY - mapY) * deltaDistY;
      }else{
        stepY = 1;
        sideDistY = (mapY + 1 - rayPosY) * deltaDistY;
      }

      while(hit === 0){
        if(sideDistX < sideDistY){
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        }else{
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        if(MAP.M[mapX][mapY] > 0){
          hit = 1;
        }
      }
      if(side===0){
        perpWallDist = Math.abs((mapX - rayPosX + (1 - stepX) / 2) / rayDirX);
      }else{
        perpWallDist = Math.abs((mapY - rayPosY + (1 - stepY) / 2) / rayDirY);
      }
      var lineHeight = Math.abs( Math.floor(h / perpWallDist ));

      var drawStart = -lineHeight / 2 + h / 2;
      if(drawStart < 0) {
        drawStart = 0;
      }
      var drawEnd = lineHeight / 2 + h / 2;
      if(drawEnd >= h) {
        drawEnd = h - 1;
      }

      var texNum = MAP.M[mapX][mapY] - 1;
      var wallX;
      if(side === 1){
        wallX = rayPosX + ((mapY - rayPosY + (1 - stepY) / 2) / rayDirY) * rayDirX;
      }else{
        wallX = rayPosY + ((mapX - rayPosX + (1 - stepY) / 2) / rayDirX) * rayDirY;
      }
      // wallX = Math.round(wallX);
      wallX -= Math.floor(wallX);
      var texX = Math.floor(wallX * 64);
      if(side === 0 && rayDirX > 0) {
        texX = 64 - texX - 1;
      }
      if(side === 1 && rayDirY < 0) {
        texX = 64 - texX - 1;
      }
      ctx.drawImage(tiles[texNum], texX,0,pixel,64, x,drawStart,pixel,drawEnd - drawStart + 1);

      var floorXWall, floorYWall;
      if(side === 0 && rayDirX > 0){
        floorXWall = mapX;
        floorYWall = mapY + wallX;
      }else if(side === 0 && rayDirX < 0){
        floorXWall = mapX + 1.0;
        floorYWall = mapY + wallX;
      }else if(side === 1 && rayDirY > 0){
        floorXWall = mapX + wallX;
        floorYWall = mapY;
      }else{
        floorXWall = mapX + wallX;
        floorYWall = mapY + 1.0;
      }
      var distWall, distPlayer, currentDist;

      distWall = perpWallDist;
      distPlayer = 0.0;
      if (drawEnd < 0) {
        drawEnd = h;
      }
      
      for(var y = drawEnd + 1; y < h; y+=pixel){
        currentDist = h / (2.0 * y - h); //you could make a small lookup table for this instead

        var weight = (currentDist - distPlayer) / (distWall - distPlayer);
         
        var currentFloorX = weight * floorXWall + (1.0 - weight) * posX;
        var currentFloorY = weight * floorYWall + (1.0 - weight) * posY;
        
        var floorTexX, floorTexY;
        floorTexX = Math.floor(currentFloorX * texWidth) % texWidth;
        floorTexY = Math.floor(currentFloorY * texHeight) % texHeight;
        
        var floorTexture = 82;
        
        ctx.drawImage(tiles[floorTexture], floorTexX, floorTexY, pixel, pixel,x,y,pixel,pixel);
        ctx.drawImage(tiles[floorTexture], floorTexX, floorTexY, pixel, pixel,x,h-y,pixel,pixel);
      }
    }

  //   var w = strips.children.length;
  //   var h = Screen.height();
  //   _.each(strips.children, function(strip, x){
  //     var cameraX = 2 * x / w - 1;
  //     var rayPosX = posX;
  //     var rayPosY = posY;
  //     var rayDirX = dirX + planeX * cameraX;
  //     var rayDirY = dirY + planeY * cameraX;
  //     var mapX = Math.floor(rayPosX);
  //     var mapY = Math.floor(rayPosY);

  //     var sideDistX;
  //     var sideDistY;

  //     var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY)/(rayDirX * rayDirX));
  //     var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX)/(rayDirY * rayDirY));
  //     var perpWallDist;

  //     var stepX;
  //     var stepY;

  //     var hit = 0;
  //     var side;

  //     if(rayDirX < 0){
  //       stepX = -1;
  //       sideDistX = (rayPosX - mapX) * deltaDistX;
  //     }else{
  //       stepX = 1;
  //       sideDistX = (mapX + 1 - rayPosX) * deltaDistX;
  //     }
  //     if(rayDirY < 0){
  //       stepY = -1;
  //       sideDistY = (rayPosY - mapY) * deltaDistY;
  //     }else{
  //       stepY = 1;
  //       sideDistY = (mapY + 1 - rayPosY) * deltaDistY;
  //     }

  //     while(hit === 0){
  //       if(sideDistX < sideDistY){
  //         sideDistX += deltaDistX;
  //         mapX += stepX;
  //         side = 0;
  //       }else{
  //         sideDistY += deltaDistY;
  //         mapY += stepY;
  //         side = 1;
  //       }
  //       if(MAP.M[mapX][mapY] > 0){
  //         hit = 1;
  //       }
  //     }
  //     if(side===0){
  //       perpWallDist = Math.abs((mapX - rayPosX + (1 - stepX) / 2) / rayDirX);
  //     }else{
  //       perpWallDist = Math.abs((mapY - rayPosY + (1 - stepY) / 2) / rayDirY);
  //     }
  //     var lineHeight = Math.abs( Math.floor(h / perpWallDist ));
  //     strip.position.y = (h - lineHeight)/2;
  //     strip.height = lineHeight;
  //     var texNum = MAP.M[mapX][mapY] - 1;
  //     var wallX;
  //     if(side === 1){
  //       wallX = rayPosX + ((mapY - rayPosY + (1 - stepY) / 2) / rayDirY) * rayDirX;
  //     }else{
  //       wallX = rayPosY + ((mapX - rayPosX + (1 - stepY) / 2) / rayDirX) * rayDirY;
  //     }
  //     wallX -= Math.floor(wallX);
  //     var texX = Math.floor(wallX * 64);
  //     if(side === 0 && rayDirX > 0) {
  //       texX = 64 - texX - 1;
  //     }
  //     if(side === 1 && rayDirY < 0) {
  //       texX = 64 - texX - 1;
  //     }
  //     var stripFrameRect = new PIXI.Rectangle(texNum * 64 + texX, 0, 1, 64);
  //     var stripTexture = new PIXI.Texture(MAP.T,stripFrameRect);
  //     strip.width = 1;
  //     strip.texture = stripTexture;
  //   });

  }

  function move(){
    oldTime = time;
    time = new Date().getTime();
    var frameTime = (time - oldTime) / 1000;
    var d = DS4.d();
    if(d !== 8){
      var theta = - PI_2 * d / 8;
      var moveDirX = dirX * Math.cos(theta) - dirY * Math.sin(theta);
      var moveDirY = dirX * Math.sin(theta) + dirY * Math.cos(theta);
      if(!MAP.M[Math.floor(posX + moveDirX * frameTime * _moveSpeed)][Math.floor(posY)]){
        posX = posX + moveDirX * frameTime * _moveSpeed;
      }
      if(!MAP.M[Math.floor(posX)][Math.floor(posY + moveDirY * frameTime * _moveSpeed)]){
        posY = posY + moveDirY * frameTime * _moveSpeed;
      }
    }

    var rotSpeed = (DS4.k('L1') - DS4.k('R1')) * _rotSpeed * frameTime;
    if(rotSpeed){
      var oldDirX = dirX;
      var oldPlaneX = planeX;
      dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
      dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
      planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
      planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
    }
  }

  function frame(){
    if(off){
      return;
    }
    castRays();
    move();
  }

  function setSpeed(moveSpeed,rotSpeed){
    _moveSpeed = moveSpeed;
    _rotSpeed = rotSpeed;
  }

  function setPos(x,y){
    posX = x;
    posY = y;
  }

  return {
    frame:frame
  , setSpeed:setSpeed
  , setPos:setPos
  , init:init
  };
})();

console.log(Camera);