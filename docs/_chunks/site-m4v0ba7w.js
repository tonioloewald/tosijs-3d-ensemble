import{He}from"./site-gh92gf7j.js";import{R,lt}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class hp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",lt)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function up(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",hp)}up();
export{hp,up};

//# debugId=B51D9080BD7D3AFC64756E2164756E21
//# sourceMappingURL=site-m4v0ba7w.js.map
