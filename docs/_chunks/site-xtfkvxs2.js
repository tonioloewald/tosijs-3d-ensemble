import{He}from"./site-x7zr027n.js";import{R,N}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Md extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",N,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Pd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Md)}Pd();
export{Md,Pd};

//# debugId=2A3FA5EF7F2397E164756E2164756E21
//# sourceMappingURL=site-xtfkvxs2.js.map
