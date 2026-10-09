import{He}from"./site-228z8wgn.js";import{R,N}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Gd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",N,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Ud(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Gd)}Ud();
export{Gd,Ud};

//# debugId=EAC9491B357CBFCB64756E2164756E21
//# sourceMappingURL=site-y2xk5be3.js.map
