import{Xe}from"./site-4mctpt5x.js";import{R,B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Nd extends Xe{constructor(e){super(e);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",B,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function kd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Nd)}kd();
export{Nd,kd};

//# debugId=0EB8FD38AED1E6A764756E2164756E21
//# sourceMappingURL=site-0nrk9r1q.js.map
