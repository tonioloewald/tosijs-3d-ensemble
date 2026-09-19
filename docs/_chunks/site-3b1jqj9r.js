import{xu as l}from"./site-gx4ww0cp.js";import{Nu as u,Pu as i}from"./site-p0rrvqfa.js";import{jF as r}from"./site-6873nq4n.js";class s extends l{constructor(e){super(e);this.sound=this.registerDataInput("sound",u),this.volume=this.registerDataInput("volume",i,1)}_execute(e,m){let o=this.sound.getValue(e);if(!o){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let n=this.volume.getValue(e);o.volume=n,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var t=!1;function a(){if(t)return;t=!0,r("FlowGraphSetSoundVolumeBlock",s)}a();
export{s as en,a as fn};

//# debugId=A7ABEE240A02CE8764756E2164756E21
//# sourceMappingURL=site-3b1jqj9r.js.map
