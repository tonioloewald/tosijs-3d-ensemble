import{He}from"./site-7z4hmt54.js";import{w,k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Gd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.motionType=this.registerDataInput("motionType",k,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Ud(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Gd)}Ud();
export{Gd,Ud};

//# debugId=0A0D41EA8E2EF9D064756E2164756E21
//# sourceMappingURL=site-s5q0t8ec.js.map
