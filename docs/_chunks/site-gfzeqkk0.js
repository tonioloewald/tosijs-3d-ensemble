import{Ye}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";import{hs}from"./site-a0s1831f.js";import{o}from"./site-3cxcjhqf.js";class Hm extends Ye{constructor(t){super(t);this.sound=this.registerDataInput("sound",R)}_execute(t,i){let r=hs(t,this.sound.getValue(t));if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Xm(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",Hm)}
export{Hm,Xm};

//# debugId=68CBACD83C47247364756E2164756E21
//# sourceMappingURL=site-gfzeqkk0.js.map
