import{Fe}from"./site-e2p70xxb.js";import{A,Ye}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Rm extends Fe{constructor(t){super(t);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this.registerDataInput("onTrue",A),this.onFalse=this.registerDataInput("onFalse",A),this.output=this.registerDataOutput("output",A)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function Am(){if(e)return;e=!0,o("FlowGraphConditionalBlock",Rm)}Am();
export{Rm,Am};

//# debugId=B2875678C185AC2064756E2164756E21
//# sourceMappingURL=site-4h700eq7.js.map
