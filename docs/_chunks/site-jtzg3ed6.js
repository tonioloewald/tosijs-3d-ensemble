import{He}from"./site-e2p70xxb.js";import{A,N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class qd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",A),this.volume=this.registerDataInput("volume",N,1)}_execute(e,i){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Zd(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",qd)}Zd();
export{qd,Zd};

//# debugId=11FB25575C7D668C64756E2164756E21
//# sourceMappingURL=site-jtzg3ed6.js.map
