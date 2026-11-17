import{Ye}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";import{us}from"./site-tn6chfpn.js";import{o}from"./site-ny31phz1.js";class Hm extends Ye{constructor(t){super(t);this.sound=this.registerDataInput("sound",A)}_execute(t,i){let r=us(t,this.sound.getValue(t));if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Xm(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",Hm)}
export{Hm,Xm};

//# debugId=31F8A63742FE701E64756E2164756E21
//# sourceMappingURL=site-82kw1p76.js.map
