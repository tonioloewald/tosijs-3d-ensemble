import{He}from"./site-nac7rcp4.js";import{w,N}from"./site-vr02jwft.js";import{o}from"./site-hbscgnbb.js";class Md extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",w),this.volume=this.registerDataInput("volume",N,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Pd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Md)}Pd();
export{Md,Pd};

//# debugId=1EC0658F020ED56A64756E2164756E21
//# sourceMappingURL=site-qmgfrbhs.js.map
