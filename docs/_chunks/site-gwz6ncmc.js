import{He}from"./site-e2p70xxb.js";import{A,lt}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class up extends He{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.velocity=this.registerDataInput("velocity",lt)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function hp(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",up)}hp();
export{up,hp};

//# debugId=7F0772694978FA7464756E2164756E21
//# sourceMappingURL=site-gwz6ncmc.js.map
