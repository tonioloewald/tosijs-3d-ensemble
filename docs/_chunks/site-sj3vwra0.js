import{Ye}from"./site-bs4qmp9a.js";import{R,je}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class s_ extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.impulse=this.registerDataInput("impulse",je),this.location=this.registerDataInput("location",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),l=this.location.getValue(t);e.applyImpulse(s,l),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function n_(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",s_)}
export{s_,n_};

//# debugId=2EAF6F9587C250E564756E2164756E21
//# sourceMappingURL=site-sj3vwra0.js.map
