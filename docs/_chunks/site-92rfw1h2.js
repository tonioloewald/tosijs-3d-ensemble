import{be}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class c_ extends be{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",A,e.initialValue)}_updateOutputs(e){let a=this.config.variable;if(e.hasVariable(a))this.value.setValue(e.getVariable(a),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var r=!1;function h_(){if(r)return;r=!0,o("FlowGraphGetVariableBlock",c_)}
export{c_,h_};

//# debugId=6AF23F92B5BF813F64756E2164756E21
//# sourceMappingURL=site-92rfw1h2.js.map
