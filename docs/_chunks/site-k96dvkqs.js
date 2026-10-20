import{Ye}from"./site-afz29jnp.js";import{Qa}from"./site-sxpn4yk2.js";import{o}from"./site-ky7rmxkt.js";class mp extends Qa{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",Ye)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}o("FlowGraphKeyDownEventBlock",mp);
export{mp};

//# debugId=2355C33282B5347364756E2164756E21
//# sourceMappingURL=site-k96dvkqs.js.map
