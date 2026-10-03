import{He}from"./site-x7zr027n.js";import{R,N}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Gd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",N,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Ud(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Gd)}Ud();
export{Gd,Ud};

//# debugId=EAC9491B357CBFCB64756E2164756E21
//# sourceMappingURL=site-0hpvxr8w.js.map
