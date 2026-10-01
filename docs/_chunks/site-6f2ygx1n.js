import{Fe,vn,qt}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class ep extends Fe{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",R,NaN),this.default=this.registerDataInput("default",R),this.value=this.registerDataOutput("value",R);let s=this.config.cases||[];for(let t of s){if(t=qt(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,R))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(vn(s))t=this._getOutputValueForCase(qt(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function tp(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",ep)}tp();
export{ep,tp};

//# debugId=11FA39A0F2BC50A464756E2164756E21
//# sourceMappingURL=site-6f2ygx1n.js.map
