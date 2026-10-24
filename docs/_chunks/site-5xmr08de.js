import{He}from"./site-7z4hmt54.js";import{w,k,Ye}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Qd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",w),this.volume=this.registerDataInput("volume",k,1),this.startOffset=this.registerDataInput("startOffset",k,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function qd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Qd)}qd();
export{Qd,qd};

//# debugId=F7B21FDC77C2081864756E2164756E21
//# sourceMappingURL=site-5xmr08de.js.map
