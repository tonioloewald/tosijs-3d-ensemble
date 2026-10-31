import{He}from"./site-td3n9zy5.js";import{R,k,Ye}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class Qd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",k,1),this.startOffset=this.registerDataInput("startOffset",k,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function qd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Qd)}qd();
export{Qd,qd};

//# debugId=16D3AC5C56AC3ADC64756E2164756E21
//# sourceMappingURL=site-f054wx8b.js.map
