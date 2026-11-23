import{R,je}from"./site-f6qdnbcs.js";import{Ui}from"./site-mw1ykdhr.js";import{o,e}from"./site-3cxcjhqf.js";class km extends Ui{constructor(t){super(je,t);this.body=this.registerDataInput("body",R)}_doOperation(t){let i=this.body.getValue(t);if(!i)return;let r=t._getExecutionVariable(this,"_cachedVelocity",null);if(!r)r=new e,t._setExecutionVariable(this,"_cachedVelocity",r);return i.getAngularVelocityToRef(r),r}getClassName(){return"FlowGraphGetAngularVelocityBlock"}}var l=!1;function Vm(){if(l)return;l=!0,o("FlowGraphGetAngularVelocityBlock",km)}
export{km,Vm};

//# debugId=C1E8CA30C097042B64756E2164756E21
//# sourceMappingURL=site-2ee9wghw.js.map
