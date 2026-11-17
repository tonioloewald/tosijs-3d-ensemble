import{Ye}from"./site-3s1j98fr.js";import{A,k}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class Lm extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.motionType=this.registerDataInput("motionType",k,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Nm(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",Lm)}
export{Lm,Nm};

//# debugId=A29AD4B56902361264756E2164756E21
//# sourceMappingURL=site-a6ttjafj.js.map
