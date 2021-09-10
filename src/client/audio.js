
var _audC = new (window.AudioContext || window.webkitAudioContext);
var _aud_MV=1; //master volumne

function tone(length,type) {
  if ((!_audC)||(!_aud_MV)) return { //a null note
    f:function() { return this; },
    v:function() { return this; } };
  var current= _audC.currentTime;
  var oscillator = _audC.createOscillator();
  var gain = _audC.createGain();

  if (type) oscillator.type=type;
  oscillator.frequency.value=0;
  gain.gain.value=0;
  oscillator.connect(gain);
  gain.connect(_audC.destination);

  oscillator.start(0);
  oscillator.stop(current+length);

  return {
    f:function() {
      if (arguments.length==1) { oscillator.frequency.value=arguments[0]; return this; }
      for (var i=0;i<arguments.length;i+=1)
        oscillator.frequency.linearRampToValueAtTime(arguments[i],current+i/(arguments.length-1)*length);
      return this;
    },
    v:function() {
      if (arguments.length==1) { gain.gain.value=arguments[0]*_aud_MV; return this; }
      for (var i=0;i<arguments.length;i+=1)
        gain.gain.linearRampToValueAtTime(arguments[i]*_aud_MV,current+i/(arguments.length-1)*length);
      return this;
    }
  };
}

var ae={
  clk: ()=>{ tone(.2,'triangle').f(200,220,200).v(.1,.3,0); tone(.2,'triangle').f(220,200,220).v(.3,.1,0); },
  crack: ()=>{
    tone(.6).f(600,100).v(.1,0);
    setTimeout(()=>{ tone(.1,'square').f(220,120,100).v(.5,.6,.3); tone(.15,'square').f(120,80,100).v(.2,.3,.5,.3);},500);
    setTimeout(()=>{ tone(.5+Math.random(),'sawtooth').f(80,60,30,20,100,80,50).v(.1,0,.1,.05,0,.05,0,.1); tone(.1+Math.random(),'sawtooth').f(20,100,30,20,60,20,50).v(.03,0,.02,.05,0,.05,0,.05); },800);
  },
  flt_in: ()=> {tone(.4).f(150,240,250).v(.1,.2,.3,0);},
  flt_out: ()=> {tone(.4).f(250,240,150).v(.1,.2,.3,0);},
  discard: ()=>{ tone(.33).f(420,440).v(.1,.3,.3,.3,.2,.1,0); },
  slide: ()=>{tone(1).f(100,440).v(.1,.3,.1,.3,.1,.5,.6,0);},
  death: ()=>{tone(2).f(100,300,100,300).v(.3,.5,.1,0); tone(2).f(200,100,200,100).v(.1,.2,.5,0); },
  weird: () => {tone(3).f(120,420).v(0,.3); tone(3).f(220,420).v(0,.3); tone(3).f(320,420).v(0,.3); },
}
