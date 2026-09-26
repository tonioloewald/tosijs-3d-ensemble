import{Fe}from"./site-e2p70xxb.js";import{A,N,lt}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Ud extends Fe{constructor(s){super(s);this.body=this.registerDataInput("body",A),this.mass=this.registerDataOutput("mass",N),this.centerOfMass=this.registerDataOutput("centerOfMass",lt),this.inertia=this.registerDataOutput("inertia",lt)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function Wd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Ud)}Wd();
export{Ud,Wd};

//# debugId=26B4A3661A0809BB64756E2164756E21
//# sourceMappingURL=site-y7q1mkc8.js.map
