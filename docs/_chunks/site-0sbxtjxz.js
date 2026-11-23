import{be,ro,si}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Km extends be{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",R,NaN),this.default=this.registerDataInput("default",R),this.value=this.registerDataOutput("value",R);let s=this.config.cases||[];for(let t of s){if(t=si(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,R))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(ro(s))t=this._getOutputValueForCase(si(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function Jm(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",Km)}
export{Km,Jm};

//# debugId=CD8ED2A49789973B64756E2164756E21
//# sourceMappingURL=site-0sbxtjxz.js.map
