import{He}from"./site-enc8r1rf.js";import{w,ct}from"./site-j2m5wc1b.js";import{o}from"./site-whc0p6f0.js";class up extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.impulse=this.registerDataInput("impulse",ct),this.location=this.registerDataInput("location",ct)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function fp(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",up)}fp();
export{up,fp};

//# debugId=B974B3F2F6D9535864756E2164756E21
//# sourceMappingURL=site-b8a0wpsj.js.map
