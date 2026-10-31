import{He}from"./site-td3n9zy5.js";import{R,ct}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class up extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.impulse=this.registerDataInput("impulse",ct),this.location=this.registerDataInput("location",ct)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function fp(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",up)}fp();
export{up,fp};

//# debugId=7F21367B83D5220064756E2164756E21
//# sourceMappingURL=site-zbv376qp.js.map
