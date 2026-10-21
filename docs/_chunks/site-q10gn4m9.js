import{He}from"./site-g4m6yns1.js";import{w,N}from"./site-4xj1x7pw.js";import{o}from"./site-w5qxkse6.js";class Od extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",w),this.volume=this.registerDataInput("volume",N,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Pd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Od)}Pd();
export{Od,Pd};

//# debugId=CD35075F4EC81E0364756E2164756E21
//# sourceMappingURL=site-q10gn4m9.js.map
