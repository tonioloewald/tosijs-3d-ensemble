import{zu as p}from"./site-s1smryc8.js";import{Pu as r,Ru as s}from"./site-y0mephjk.js";import{lF as i}from"./site-54y5gp1n.js";class a extends p{constructor(t){super(t);this.body=this.registerDataInput("body",r),this.motionType=this.registerDataInput("motionType",s,2)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var o=!1;function h(){if(o)return;o=!0,i("FlowGraphSetPhysicsMotionTypeBlock",a)}h();
export{a as xn,h as yn};

//# debugId=C2ACE1A53BFBD54064756E2164756E21
//# sourceMappingURL=site-vm44tkdx.js.map
