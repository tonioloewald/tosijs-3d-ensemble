import{He}from"./site-7z4hmt54.js";import{w,k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Od extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",w),this.volume=this.registerDataInput("volume",k,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Pd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Od)}Pd();
export{Od,Pd};

//# debugId=B49591577F63CFF764756E2164756E21
//# sourceMappingURL=site-49ctt46q.js.map
