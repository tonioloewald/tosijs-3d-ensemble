import{He}from"./site-2m9hnh4q.js";import{Ql}from"./site-ae3f1v5y.js";import{o}from"./site-ny31phz1.js";class lg extends Ql{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",He)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}var s=!1;function cg(){if(s)return;s=!0,o("FlowGraphKeyDownEventBlock",lg)}
export{lg,cg};

//# debugId=D7C873CCAD563C3764756E2164756E21
//# sourceMappingURL=site-et3qhz5y.js.map
