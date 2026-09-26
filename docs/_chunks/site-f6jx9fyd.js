import{He}from"./site-e2p70xxb.js";import{A,N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Fd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.motionType=this.registerDataInput("motionType",N,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Bd(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Fd)}Bd();
export{Fd,Bd};

//# debugId=949CC773F5B3014464756E2164756E21
//# sourceMappingURL=site-f6jx9fyd.js.map
