import{Ye}from"./site-3s1j98fr.js";import{A,je}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class og extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.velocity=this.registerDataInput("velocity",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setLinearVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function ag(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",og)}
export{og,ag};

//# debugId=9EF3D901DB75ADAE64756E2164756E21
//# sourceMappingURL=site-0z76wsjy.js.map
