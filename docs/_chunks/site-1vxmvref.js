import{Iu as s}from"./site-rab9t16m.js";import{Nu as o,Qu as r}from"./site-p0rrvqfa.js";import{jF as i}from"./site-6873nq4n.js";class a extends s{constructor(t){super(t);this.condition=this.registerDataInput("condition",r),this.onTrue=this.registerDataInput("onTrue",o),this.onFalse=this.registerDataInput("onFalse",o),this.output=this.registerDataOutput("output",o)}_updateOutputs(t){let l=this.condition.getValue(t);this.output.setValue(l?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function n(){if(e)return;e=!0,i("FlowGraphConditionalBlock",a)}n();
export{a as cp,n as dp};

//# debugId=4D4479C36C6B497864756E2164756E21
//# sourceMappingURL=site-1vxmvref.js.map
