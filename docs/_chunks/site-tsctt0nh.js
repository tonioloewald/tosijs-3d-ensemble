import{He}from"./site-403rb1zc.js";import{w}from"./site-1yfx1bcx.js";import{o}from"./site-wmfzbjvy.js";class Zd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",w)}_execute(t,i){let r=this.sound.getValue(t);if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Kd(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",Zd)}Kd();
export{Zd,Kd};

//# debugId=05413E3E9A53CFF064756E2164756E21
//# sourceMappingURL=site-tsctt0nh.js.map
