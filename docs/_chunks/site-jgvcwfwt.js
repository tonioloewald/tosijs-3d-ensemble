import{Ye}from"./site-3s1j98fr.js";import{A,je}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class ig extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.force=this.registerDataInput("force",je),this.location=this.registerDataInput("location",je)}_execute(t,a){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);e.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var r=!1;function rg(){if(r)return;r=!0,o("FlowGraphApplyForceBlock",ig)}
export{ig,rg};

//# debugId=76B17F80A320C99F64756E2164756E21
//# sourceMappingURL=site-jgvcwfwt.js.map
