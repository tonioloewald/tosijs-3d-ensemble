import{w,lt}from"./site-ws3bshz1.js";import{Ri}from"./site-t8htek3a.js";import{o,e}from"./site-pmpcb5qm.js";class Wd extends Ri{constructor(t){super(lt,t);this.body=this.registerDataInput("body",w)}_doOperation(t){let i=this.body.getValue(t);if(!i)return;let r=t._getExecutionVariable(this,"_cachedVelocity",null);if(!r)r=new e,t._setExecutionVariable(this,"_cachedVelocity",r);return i.getLinearVelocityToRef(r),r}getClassName(){return"FlowGraphGetLinearVelocityBlock"}}var l=!1;function Hd(){if(l)return;l=!0,o("FlowGraphGetLinearVelocityBlock",Wd)}Hd();
export{Wd,Hd};

//# debugId=62F894142B5B1B6164756E2164756E21
//# sourceMappingURL=site-1t21hsp6.js.map
