import{Ye}from"./site-bs4qmp9a.js";import{R,B,He}from"./site-f6qdnbcs.js";import{hs}from"./site-a0s1831f.js";import{o}from"./site-3cxcjhqf.js";class Um extends Ye{constructor(t){super(t);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",B,1),this.startOffset=this.registerDataInput("startOffset",B,0),this.loop=this.registerDataInput("loop",He,!1)}_execute(t,i){let e=hs(t,this.sound.getValue(t));if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function Wm(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Um)}
export{Um,Wm};

//# debugId=2450103A69BA074764756E2164756E21
//# sourceMappingURL=site-7h5cdxb8.js.map
