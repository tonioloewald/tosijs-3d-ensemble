import{Ye}from"./site-3s1j98fr.js";import{A,k}from"./site-2m9hnh4q.js";import{us}from"./site-tn6chfpn.js";import{o}from"./site-ny31phz1.js";class gm extends Ye{constructor(e){super(e);this.sound=this.registerDataInput("sound",A),this.volume=this.registerDataInput("volume",k,1)}_execute(e,i){let t=us(e,this.sound.getValue(e));if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function _m(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",gm)}
export{gm,_m};

//# debugId=0E7F7FA703064AF864756E2164756E21
//# sourceMappingURL=site-6k83m5ay.js.map
