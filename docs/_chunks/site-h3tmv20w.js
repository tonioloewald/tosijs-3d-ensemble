import{Ye}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";import{hs}from"./site-a0s1831f.js";import{o}from"./site-3cxcjhqf.js";class $m extends Ye{constructor(e){super(e);this.sound=this.registerDataInput("sound",R)}_execute(e,s){let t=hs(e,this.sound.getValue(e));if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function Ym(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",$m)}
export{$m,Ym};

//# debugId=592D846E0796613364756E2164756E21
//# sourceMappingURL=site-h3tmv20w.js.map
