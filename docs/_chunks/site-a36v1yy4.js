import{Xe}from"./site-4mctpt5x.js";import{R,ct}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class dp extends Xe{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.force=this.registerDataInput("force",ct),this.location=this.registerDataInput("location",ct)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function pp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",dp)}pp();
export{dp,pp};

//# debugId=2D1F3D1FE92B274664756E2164756E21
//# sourceMappingURL=site-a36v1yy4.js.map
