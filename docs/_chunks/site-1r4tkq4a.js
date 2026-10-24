import{Ye}from"./site-169k801a.js";import{qa}from"./site-ympyv79h.js";import{o}from"./site-g2k0zkaa.js";class mp extends qa{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",Ye)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}o("FlowGraphKeyDownEventBlock",mp);
export{mp};

//# debugId=5C3EB917D40002A164756E2164756E21
//# sourceMappingURL=site-1r4tkq4a.js.map
