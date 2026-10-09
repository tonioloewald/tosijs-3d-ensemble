import{He}from"./site-228z8wgn.js";import{R,N,Ye}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Qd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",N,1),this.startOffset=this.registerDataInput("startOffset",N,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function qd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Qd)}qd();
export{Qd,qd};

//# debugId=2DCE7519F64C79FF64756E2164756E21
//# sourceMappingURL=site-3ns8pkn5.js.map
