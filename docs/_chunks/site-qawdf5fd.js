import{Ye}from"./site-bs4qmp9a.js";import{R,je}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class i_ extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.force=this.registerDataInput("force",je),this.location=this.registerDataInput("location",je)}_execute(t,a){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);e.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var r=!1;function r_(){if(r)return;r=!0,o("FlowGraphApplyForceBlock",i_)}
export{i_,r_};

//# debugId=6C7F4ED16E46827B64756E2164756E21
//# sourceMappingURL=site-qawdf5fd.js.map
