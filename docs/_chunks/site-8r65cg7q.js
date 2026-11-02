import{Xe}from"./site-4mctpt5x.js";import{R,B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Xd extends Xe{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",B,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function $d(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Xd)}$d();
export{Xd,$d};

//# debugId=7805BC0CCD8FCFBC64756E2164756E21
//# sourceMappingURL=site-8r65cg7q.js.map
