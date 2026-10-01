import{He}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class $d extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",R)}_execute(t,i){let r=this.sound.getValue(t);if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Yd(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",$d)}Yd();
export{$d,Yd};

//# debugId=62C10A60997CCA5B64756E2164756E21
//# sourceMappingURL=site-r9x0k2z2.js.map
