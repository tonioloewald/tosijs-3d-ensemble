import{He}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class $d extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",A)}_execute(t,i){let r=this.sound.getValue(t);if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Yd(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",$d)}Yd();
export{$d,Yd};

//# debugId=ACAD0E497A666A4864756E2164756E21
//# sourceMappingURL=site-z7b1z0jw.js.map
