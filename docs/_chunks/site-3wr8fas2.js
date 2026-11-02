import{nr}from"./site-4mctpt5x.js";import{je}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Sm extends nr{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",je)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function ym(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",Sm)}ym();
export{Sm,ym};

//# debugId=91909516058B961C64756E2164756E21
//# sourceMappingURL=site-3wr8fas2.js.map
