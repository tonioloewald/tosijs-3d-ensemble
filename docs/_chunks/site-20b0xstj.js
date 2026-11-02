import{Xe}from"./site-4mctpt5x.js";import{R,ct}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class _p extends Xe{constructor(e){super(e);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",ct)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function xp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",_p)}xp();
export{_p,xp};

//# debugId=ED0951D10D1D929964756E2164756E21
//# sourceMappingURL=site-20b0xstj.js.map
