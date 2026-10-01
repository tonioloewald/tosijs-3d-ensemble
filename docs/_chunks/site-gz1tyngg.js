import{He}from"./site-gh92gf7j.js";import{R,lt}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class op extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.impulse=this.registerDataInput("impulse",lt),this.location=this.registerDataInput("location",lt)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function ap(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",op)}ap();
export{op,ap};

//# debugId=72F01C90D150B47D64756E2164756E21
//# sourceMappingURL=site-gz1tyngg.js.map
