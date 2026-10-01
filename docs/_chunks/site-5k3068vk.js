import{He}from"./site-gh92gf7j.js";import{R,N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Fd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",N,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function kd(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Fd)}kd();
export{Fd,kd};

//# debugId=8EA06D919F83F96064756E2164756E21
//# sourceMappingURL=site-5k3068vk.js.map
