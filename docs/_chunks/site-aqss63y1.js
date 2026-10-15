import{He}from"./site-rzgrmjyd.js";import{w,lt}from"./site-ws3bshz1.js";import{o}from"./site-pmpcb5qm.js";class dp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",w),this.velocity=this.registerDataInput("velocity",lt)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function pp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",dp)}pp();
export{dp,pp};

//# debugId=F0744BAEF487F26A64756E2164756E21
//# sourceMappingURL=site-aqss63y1.js.map
