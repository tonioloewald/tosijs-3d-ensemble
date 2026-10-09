import{He}from"./site-228z8wgn.js";import{R,lt}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class cp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.force=this.registerDataInput("force",lt),this.location=this.registerDataInput("location",lt)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function hp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",cp)}hp();
export{cp,hp};

//# debugId=C9FE2F41850E681A64756E2164756E21
//# sourceMappingURL=site-ycp1eqqc.js.map
