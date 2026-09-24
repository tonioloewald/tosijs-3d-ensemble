import{zu as l}from"./site-s1smryc8.js";import{Pu as u,Ru as i}from"./site-y0mephjk.js";import{lF as r}from"./site-54y5gp1n.js";class s extends l{constructor(e){super(e);this.sound=this.registerDataInput("sound",u),this.volume=this.registerDataInput("volume",i,1)}_execute(e,m){let o=this.sound.getValue(e);if(!o){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let n=this.volume.getValue(e);o.volume=n,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var t=!1;function a(){if(t)return;t=!0,r("FlowGraphSetSoundVolumeBlock",s)}a();
export{s as gn,a as hn};

//# debugId=5B0C08D99C7B813E64756E2164756E21
//# sourceMappingURL=site-nnh5dnks.js.map
