import{Xe}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class tp extends Xe{constructor(t){super(t);this.sound=this.registerDataInput("sound",R)}_execute(t,i){let r=this.sound.getValue(t);if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function ip(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",tp)}ip();
export{tp,ip};

//# debugId=E4F38BDB2FC5BC3864756E2164756E21
//# sourceMappingURL=site-2w5q3ccr.js.map
