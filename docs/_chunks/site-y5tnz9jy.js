import{He}from"./site-3q4gqkf5.js";import{w,lt}from"./site-9g37ftzw.js";import{o}from"./site-16qs5rck.js";class up extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.impulse=this.registerDataInput("impulse",lt),this.location=this.registerDataInput("location",lt)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function fp(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",up)}fp();
export{up,fp};

//# debugId=ACF1CF51C8CBE0C364756E2164756E21
//# sourceMappingURL=site-y5tnz9jy.js.map
