import{Ne}from"./site-4mctpt5x.js";import{R,je}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class nm extends Ne{constructor(t){super(t);this.condition=this.registerDataInput("condition",je),this.onTrue=this.registerDataInput("onTrue",R),this.onFalse=this.registerDataInput("onFalse",R),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function om(){if(e)return;e=!0,o("FlowGraphConditionalBlock",nm)}om();
export{nm,om};

//# debugId=9ABBD61A7DA41EC464756E2164756E21
//# sourceMappingURL=site-krbdtkke.js.map
