import{He}from"./site-td3n9zy5.js";import{R,ct}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class dp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",ct)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function pp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",dp)}pp();
export{dp,pp};

//# debugId=30F820F83BE9524264756E2164756E21
//# sourceMappingURL=site-rk585r66.js.map
