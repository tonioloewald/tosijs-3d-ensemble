import{Ye}from"./site-bs4qmp9a.js";import{R,B}from"./site-f6qdnbcs.js";import{hs}from"./site-a0s1831f.js";import{o}from"./site-3cxcjhqf.js";class _m extends Ye{constructor(e){super(e);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",B,1)}_execute(e,i){let t=hs(e,this.sound.getValue(e));if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function gm(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",_m)}
export{_m,gm};

//# debugId=6EA8B73608F5929E64756E2164756E21
//# sourceMappingURL=site-fgj6d7ha.js.map
