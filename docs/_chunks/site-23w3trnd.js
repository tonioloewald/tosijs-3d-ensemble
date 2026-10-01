import{Fe}from"./site-gh92gf7j.js";import{R,Ye}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Am extends Fe{constructor(t){super(t);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this.registerDataInput("onTrue",R),this.onFalse=this.registerDataInput("onFalse",R),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function Rm(){if(e)return;e=!0,o("FlowGraphConditionalBlock",Am)}Rm();
export{Am,Rm};

//# debugId=8D89D1F23160397C64756E2164756E21
//# sourceMappingURL=site-23w3trnd.js.map
