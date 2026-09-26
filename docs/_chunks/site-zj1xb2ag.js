import{He}from"./site-e2p70xxb.js";import{A,lt}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class lp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",A),this.velocity=this.registerDataInput("velocity",lt)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function cp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",lp)}cp();
export{lp,cp};

//# debugId=FC7F1BDDCDAEE5A164756E2164756E21
//# sourceMappingURL=site-zj1xb2ag.js.map
