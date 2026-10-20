import{Ye}from"./site-j2m5wc1b.js";import{Qa}from"./site-hgdehtvh.js";import{o}from"./site-whc0p6f0.js";class mp extends Qa{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",Ye)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}o("FlowGraphKeyDownEventBlock",mp);
export{mp};

//# debugId=2355C33282B5347364756E2164756E21
//# sourceMappingURL=site-xbhwj7f0.js.map
