import{He}from"./site-gh92gf7j.js";import{R,lt}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class lp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",lt)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function cp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",lp)}cp();
export{lp,cp};

//# debugId=99D49EFD9FEEAC3A64756E2164756E21
//# sourceMappingURL=site-w4ygk899.js.map
