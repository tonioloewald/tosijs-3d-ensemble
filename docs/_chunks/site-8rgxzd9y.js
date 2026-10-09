import{Le}from"./site-228z8wgn.js";import{R,Ye}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class tm extends Le{constructor(t){super(t);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this.registerDataInput("onTrue",R),this.onFalse=this.registerDataInput("onFalse",R),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function im(){if(e)return;e=!0,o("FlowGraphConditionalBlock",tm)}im();
export{tm,im};

//# debugId=A2E5B1FC9890394F64756E2164756E21
//# sourceMappingURL=site-8rgxzd9y.js.map
