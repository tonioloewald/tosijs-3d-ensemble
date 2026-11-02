import{Xe}from"./site-4mctpt5x.js";import{R,ct}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class mp extends Xe{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.impulse=this.registerDataInput("impulse",ct),this.location=this.registerDataInput("location",ct)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function gp(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",mp)}gp();
export{mp,gp};

//# debugId=1DE4B89F6268914B64756E2164756E21
//# sourceMappingURL=site-4t5qxxjb.js.map
