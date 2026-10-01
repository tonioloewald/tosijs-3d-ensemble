import{He}from"./site-gh92gf7j.js";import{R,N,Ye}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Hd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",N,1),this.startOffset=this.registerDataInput("startOffset",N,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function Xd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Hd)}Xd();
export{Hd,Xd};

//# debugId=A8FDFBB8C5CC582B64756E2164756E21
//# sourceMappingURL=site-7v8cjr8k.js.map
