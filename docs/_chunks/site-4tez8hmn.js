import{xu as p}from"./site-gx4ww0cp.js";import{Nu as r,Pu as s}from"./site-p0rrvqfa.js";import{jF as i}from"./site-6873nq4n.js";class a extends p{constructor(t){super(t);this.body=this.registerDataInput("body",r),this.motionType=this.registerDataInput("motionType",s,2)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var o=!1;function h(){if(o)return;o=!0,i("FlowGraphSetPhysicsMotionTypeBlock",a)}h();
export{a as vn,h as wn};

//# debugId=A4AB5BA433CFDF9864756E2164756E21
//# sourceMappingURL=site-4tez8hmn.js.map
