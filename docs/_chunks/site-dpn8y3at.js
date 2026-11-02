import{Xe}from"./site-4mctpt5x.js";import{R,B,je}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Jd extends Xe{constructor(t){super(t);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",B,1),this.startOffset=this.registerDataInput("startOffset",B,0),this.loop=this.registerDataInput("loop",je,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function ep(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Jd)}ep();
export{Jd,ep};

//# debugId=9652D365A3B169A464756E2164756E21
//# sourceMappingURL=site-dpn8y3at.js.map
