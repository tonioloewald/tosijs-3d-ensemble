import{Ye}from"./site-3s1j98fr.js";import{A,je}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class sg extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.impulse=this.registerDataInput("impulse",je),this.location=this.registerDataInput("location",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),l=this.location.getValue(t);e.applyImpulse(s,l),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function ng(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",sg)}
export{sg,ng};

//# debugId=18CCF89CDF0A969F64756E2164756E21
//# sourceMappingURL=site-fzqj1xj5.js.map
