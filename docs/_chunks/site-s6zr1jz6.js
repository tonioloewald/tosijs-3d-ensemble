import{He}from"./site-enc8r1rf.js";import{w,N,Ye}from"./site-j2m5wc1b.js";import{o}from"./site-whc0p6f0.js";class Qd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",w),this.volume=this.registerDataInput("volume",N,1),this.startOffset=this.registerDataInput("startOffset",N,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function qd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Qd)}qd();
export{Qd,qd};

//# debugId=78860D96420B24C964756E2164756E21
//# sourceMappingURL=site-s6zr1jz6.js.map
