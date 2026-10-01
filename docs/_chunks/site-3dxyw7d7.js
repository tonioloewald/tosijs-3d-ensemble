import{He}from"./site-gh92gf7j.js";import{R,N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class qd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",N,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Zd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",qd)}Zd();
export{qd,Zd};

//# debugId=F063105222BF3CF964756E2164756E21
//# sourceMappingURL=site-3dxyw7d7.js.map
