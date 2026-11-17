import{be}from"./site-3s1j98fr.js";import{A,He}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class Kg extends be{constructor(t){super(t);this.condition=this.registerDataInput("condition",He),this.onTrue=this.registerDataInput("onTrue",A),this.onFalse=this.registerDataInput("onFalse",A),this.output=this.registerDataOutput("output",A)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function Zg(){if(e)return;e=!0,o("FlowGraphConditionalBlock",Kg)}
export{Kg,Zg};

//# debugId=6D1179A0E301566E64756E2164756E21
//# sourceMappingURL=site-494kdp39.js.map
