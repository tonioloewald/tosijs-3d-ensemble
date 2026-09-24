import{Ku as s}from"./site-18c2qzzn.js";import{Pu as o,Su as r}from"./site-y0mephjk.js";import{lF as i}from"./site-54y5gp1n.js";class a extends s{constructor(t){super(t);this.condition=this.registerDataInput("condition",r),this.onTrue=this.registerDataInput("onTrue",o),this.onFalse=this.registerDataInput("onFalse",o),this.output=this.registerDataOutput("output",o)}_updateOutputs(t){let l=this.condition.getValue(t);this.output.setValue(l?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function n(){if(e)return;e=!0,i("FlowGraphConditionalBlock",a)}n();
export{a as ep,n as fp};

//# debugId=AA6F9E163C33567464756E2164756E21
//# sourceMappingURL=site-jk42r3k2.js.map
