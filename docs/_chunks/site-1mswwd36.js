import{He}from"./site-3hrxh888.js";import{w,ct}from"./site-phrx5rwy.js";import{o}from"./site-300ftf42.js";class cp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.force=this.registerDataInput("force",ct),this.location=this.registerDataInput("location",ct)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function hp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",cp)}hp();
export{cp,hp};

//# debugId=AF99F50BCA892B1764756E2164756E21
//# sourceMappingURL=site-1mswwd36.js.map
