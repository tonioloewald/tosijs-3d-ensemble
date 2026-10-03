import{Fe}from"./site-x7zr027n.js";import{R,Ye}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class tm extends Fe{constructor(t){super(t);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this.registerDataInput("onTrue",R),this.onFalse=this.registerDataInput("onFalse",R),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function im(){if(e)return;e=!0,o("FlowGraphConditionalBlock",tm)}im();
export{tm,im};

//# debugId=04010552DF04DA3864756E2164756E21
//# sourceMappingURL=site-1ae7e0wy.js.map
