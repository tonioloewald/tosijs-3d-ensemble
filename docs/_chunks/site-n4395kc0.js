import{He}from"./site-dkd9tveg.js";import{w,ct}from"./site-jw81twe3.js";import{o}from"./site-mkftt73g.js";class cp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.force=this.registerDataInput("force",ct),this.location=this.registerDataInput("location",ct)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function hp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",cp)}hp();
export{cp,hp};

//# debugId=AF99F50BCA892B1764756E2164756E21
//# sourceMappingURL=site-n4395kc0.js.map
