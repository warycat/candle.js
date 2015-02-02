var DS4 = (function(){
  var _hex = '080000';
  var _state = parseInt(_hex,16);
  var names =     ['PS','PAD','L1','R1','L2','R2','SHR','OPT','L3','R3','A','B','C','D'];
  var offsets =   [0, 1, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23];

  function k(name){
    return key(name,_state);
  }

  function key(name,s){
    var index = names.indexOf(name);
    var mask = 1 << offsets[index];
    return (mask & s)?1:0;
  }

  function update(hex){
    var state = parseInt(hex,16);
    _hex = hex;
    _.each(names,function(name){
      if(key(name,state) !== key(name,_state)){
        var e = name + '_' + k(name);
        DS4.emit(e);
      }
    });
    _state = state;
  }

  function debug(){
    var all = [];
    _.each(names,function(name){
      all.push(name);
      all.push(k(name));
    });
    console.log(_hex,d(),all);
  }

  function d(){
    return (_state & (0x0f << 16)) >> 16;
  }

  var r = {
    update:update
  , k:k
  , d:d
  , debug:debug
  };
  PIXI.EventTarget.call(r);
  return r;
})();

console.log(DS4);

var socket = io('http://localhost:3000');
socket.on('connect', function(){
  socket.on('s', function(hex){
    DS4.update(hex);
  });
  socket.on('disconnect', function(){});
});