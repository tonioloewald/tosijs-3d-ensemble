import{He}from"./site-rzgrmjyd.js";import{w}from"./site-ws3bshz1.js";import{o}from"./site-pmpcb5qm.js";class Jd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",w)}_execute(e,s){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function ep(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",Jd)}ep();
export{Jd,ep};

//# debugId=FB050C60E1CF8A0664756E2164756E21
//# sourceMappingURL=site-2ea5y1ey.js.map
