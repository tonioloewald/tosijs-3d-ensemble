import{He}from"./site-gh92gf7j.js";import{R,lt}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class sp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.force=this.registerDataInput("force",lt),this.location=this.registerDataInput("location",lt)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function np(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",sp)}np();
export{sp,np};

//# debugId=CF008343253F724264756E2164756E21
//# sourceMappingURL=site-mtnm1bh2.js.map
