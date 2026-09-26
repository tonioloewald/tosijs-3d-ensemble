import{He}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class jd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",A)}_execute(e,s){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function Qd(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",jd)}Qd();
export{jd,Qd};

//# debugId=B70432EE05F99ECE64756E2164756E21
//# sourceMappingURL=site-x836tqaz.js.map
