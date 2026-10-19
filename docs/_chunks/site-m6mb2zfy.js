import{He}from"./site-403rb1zc.js";import{w,ct}from"./site-1yfx1bcx.js";import{o}from"./site-wmfzbjvy.js";class dp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",w),this.velocity=this.registerDataInput("velocity",ct)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function pp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",dp)}pp();
export{dp,pp};

//# debugId=2043ED4DEF683E6264756E2164756E21
//# sourceMappingURL=site-m6mb2zfy.js.map
