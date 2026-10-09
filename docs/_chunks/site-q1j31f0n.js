import{He}from"./site-228z8wgn.js";import{R}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Jd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",R)}_execute(e,s){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function ep(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",Jd)}ep();
export{Jd,ep};

//# debugId=E5737608F49B5FD364756E2164756E21
//# sourceMappingURL=site-q1j31f0n.js.map
