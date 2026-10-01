import{Fe}from"./site-gh92gf7j.js";import{R,N,lt}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Ud extends Fe{constructor(s){super(s);this.body=this.registerDataInput("body",R),this.mass=this.registerDataOutput("mass",N),this.centerOfMass=this.registerDataOutput("centerOfMass",lt),this.inertia=this.registerDataOutput("inertia",lt)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function Wd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Ud)}Wd();
export{Ud,Wd};

//# debugId=A13B66A3E344115964756E2164756E21
//# sourceMappingURL=site-hb413chj.js.map
