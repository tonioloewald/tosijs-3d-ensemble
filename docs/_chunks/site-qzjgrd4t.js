import{be}from"./site-bs4qmp9a.js";import{R,He}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Z_ extends be{constructor(t){super(t);this.condition=this.registerDataInput("condition",He),this.onTrue=this.registerDataInput("onTrue",R),this.onFalse=this.registerDataInput("onFalse",R),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function K_(){if(e)return;e=!0,o("FlowGraphConditionalBlock",Z_)}
export{Z_,K_};

//# debugId=919315DE1346BA3664756E2164756E21
//# sourceMappingURL=site-qzjgrd4t.js.map
