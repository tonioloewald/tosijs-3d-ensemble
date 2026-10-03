import{He}from"./site-x7zr027n.js";import{R}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Jd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",R)}_execute(e,s){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function ep(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",Jd)}ep();
export{Jd,ep};

//# debugId=E5737608F49B5FD364756E2164756E21
//# sourceMappingURL=site-yay0f8k4.js.map
