import{be}from"./site-bs4qmp9a.js";import{R,B,je}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class zm extends be{constructor(s){super(s);this.body=this.registerDataInput("body",R),this.mass=this.registerDataOutput("mass",B),this.centerOfMass=this.registerDataOutput("centerOfMass",je),this.inertia=this.registerDataOutput("inertia",je)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function Gm(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",zm)}
export{zm,Gm};

//# debugId=24C2D00E42342A3E64756E2164756E21
//# sourceMappingURL=site-hz7ap7v2.js.map
