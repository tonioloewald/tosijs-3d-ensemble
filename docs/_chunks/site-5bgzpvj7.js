import{He}from"./site-228z8wgn.js";import{R,lt}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class up extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.impulse=this.registerDataInput("impulse",lt),this.location=this.registerDataInput("location",lt)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function fp(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",up)}fp();
export{up,fp};

//# debugId=610D93B08FE45F2E64756E2164756E21
//# sourceMappingURL=site-5bgzpvj7.js.map
