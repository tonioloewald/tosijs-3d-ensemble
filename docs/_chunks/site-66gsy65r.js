import{He}from"./site-rzgrmjyd.js";import{w,N}from"./site-ws3bshz1.js";import{o}from"./site-pmpcb5qm.js";class Gd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.motionType=this.registerDataInput("motionType",N,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Ud(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Gd)}Ud();
export{Gd,Ud};

//# debugId=0EC33B4458BBBA5264756E2164756E21
//# sourceMappingURL=site-66gsy65r.js.map
