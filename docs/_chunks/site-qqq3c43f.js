import{He}from"./site-td3n9zy5.js";import{R,k}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class Gd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",k,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Ud(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Gd)}Ud();
export{Gd,Ud};

//# debugId=9D166187B3A4188364756E2164756E21
//# sourceMappingURL=site-qqq3c43f.js.map
