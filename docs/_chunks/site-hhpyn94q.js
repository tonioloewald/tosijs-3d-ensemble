import{He}from"./site-0215gf70.js";import{w,N,Ye}from"./site-afz29jnp.js";import{o}from"./site-ky7rmxkt.js";class Qd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",w),this.volume=this.registerDataInput("volume",N,1),this.startOffset=this.registerDataInput("startOffset",N,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function qd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Qd)}qd();
export{Qd,qd};

//# debugId=78860D96420B24C964756E2164756E21
//# sourceMappingURL=site-hhpyn94q.js.map
