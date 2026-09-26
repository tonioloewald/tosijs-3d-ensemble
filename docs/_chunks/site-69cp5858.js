import{Fe,vn,qt}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class ep extends Fe{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",A,NaN),this.default=this.registerDataInput("default",A),this.value=this.registerDataOutput("value",A);let s=this.config.cases||[];for(let t of s){if(t=qt(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,A))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(vn(s))t=this._getOutputValueForCase(qt(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function tp(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",ep)}tp();
export{ep,tp};

//# debugId=67AA5C9FF7FB9FD164756E2164756E21
//# sourceMappingURL=site-69cp5858.js.map
