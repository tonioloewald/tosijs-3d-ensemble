import{He}from"./site-228z8wgn.js";import{R,lt}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class dp extends He{constructor(e){super(e);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",lt)}_execute(e,r){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function pp(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",dp)}pp();
export{dp,pp};

//# debugId=37619E841681056C64756E2164756E21
//# sourceMappingURL=site-s57ktgja.js.map
