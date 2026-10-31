import{He}from"./site-td3n9zy5.js";import{R,k}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class Od extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",k,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Pd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Od)}Pd();
export{Od,Pd};

//# debugId=422F3E6D2D8DC02664756E2164756E21
//# sourceMappingURL=site-vjtv7axt.js.map
