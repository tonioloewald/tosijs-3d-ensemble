import{He}from"./site-vc4knhgc.js";import{w,lt}from"./site-1fkjz1t9.js";import{o}from"./site-bg3xbkq8.js";class cp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.force=this.registerDataInput("force",lt),this.location=this.registerDataInput("location",lt)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function hp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",cp)}hp();
export{cp,hp};

//# debugId=3EA649A815CA657364756E2164756E21
//# sourceMappingURL=site-cgcr0g0t.js.map
