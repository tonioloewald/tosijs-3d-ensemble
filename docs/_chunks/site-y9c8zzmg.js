import{He}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class jd extends He{constructor(e){super(e);this.sound=this.registerDataInput("sound",R)}_execute(e,s){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function Qd(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",jd)}Qd();
export{jd,Qd};

//# debugId=5C52FDDC52B7509F64756E2164756E21
//# sourceMappingURL=site-y9c8zzmg.js.map
