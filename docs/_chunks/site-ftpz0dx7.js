import{be,ro,si}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class Zm extends be{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",A,NaN),this.default=this.registerDataInput("default",A),this.value=this.registerDataOutput("value",A);let s=this.config.cases||[];for(let t of s){if(t=si(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,A))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(ro(s))t=this._getOutputValueForCase(si(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function Jm(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",Zm)}
export{Zm,Jm};

//# debugId=E23CA224F1EA677C64756E2164756E21
//# sourceMappingURL=site-ftpz0dx7.js.map
