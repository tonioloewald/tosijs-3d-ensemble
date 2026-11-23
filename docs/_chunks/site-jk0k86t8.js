import{be}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class cg extends be{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let a=this.config.variable;if(e.hasVariable(a))this.value.setValue(e.getVariable(a),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var r=!1;function ug(){if(r)return;r=!0,o("FlowGraphGetVariableBlock",cg)}
export{cg,ug};

//# debugId=7DCB486757BBA7E564756E2164756E21
//# sourceMappingURL=site-jk0k86t8.js.map
