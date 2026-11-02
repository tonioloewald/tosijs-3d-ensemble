import{Xe}from"./site-4mctpt5x.js";import{R,ct}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Wd extends Xe{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",ct)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function Hd(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",Wd)}Hd();
export{Wd,Hd};

//# debugId=6034D16EFB317A9164756E2164756E21
//# sourceMappingURL=site-fwq5hj7v.js.map
