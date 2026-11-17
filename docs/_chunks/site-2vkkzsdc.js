import{A,je}from"./site-2m9hnh4q.js";import{Ui}from"./site-8td6vznh.js";import{o,e}from"./site-ny31phz1.js";class Bm extends Ui{constructor(t){super(je,t);this.body=this.registerDataInput("body",A)}_doOperation(t){let i=this.body.getValue(t);if(!i)return;let r=t._getExecutionVariable(this,"_cachedVelocity",null);if(!r)r=new e,t._setExecutionVariable(this,"_cachedVelocity",r);return i.getLinearVelocityToRef(r),r}getClassName(){return"FlowGraphGetLinearVelocityBlock"}}var l=!1;function km(){if(l)return;l=!0,o("FlowGraphGetLinearVelocityBlock",Bm)}
export{Bm,km};

//# debugId=EC341922D70F200D64756E2164756E21
//# sourceMappingURL=site-2vkkzsdc.js.map
