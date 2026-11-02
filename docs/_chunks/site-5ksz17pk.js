import{Xe}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class rp extends Xe{constructor(e){super(e);this.sound=this.registerDataInput("sound",R)}_execute(e,s){let t=this.sound.getValue(e);if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function sp(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",rp)}sp();
export{rp,sp};

//# debugId=CF7706667342468764756E2164756E21
//# sourceMappingURL=site-5ksz17pk.js.map
