import{Ye}from"./site-bs4qmp9a.js";import{R,B}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Nm extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",B,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Lm(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Nm)}
export{Nm,Lm};

//# debugId=039251130642DE3364756E2164756E21
//# sourceMappingURL=site-nv832edb.js.map
