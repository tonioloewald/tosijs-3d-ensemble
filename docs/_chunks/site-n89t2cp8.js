import{He}from"./site-7z4hmt54.js";import{w,ct}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class dp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",w),this.velocity=this.registerDataInput("velocity",ct)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function pp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",dp)}pp();
export{dp,pp};

//# debugId=2043ED4DEF683E6264756E2164756E21
//# sourceMappingURL=site-n89t2cp8.js.map
