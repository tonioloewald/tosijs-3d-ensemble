import{Yn as a}from"./site-f127zxa2.js";import{Su as o}from"./site-y0mephjk.js";import{lF as s}from"./site-54y5gp1n.js";class p extends a{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",o)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}s("FlowGraphKeyDownEventBlock",p);
export{p as Wn};

//# debugId=2A4F0BAC487A2CD464756E2164756E21
//# sourceMappingURL=site-pszjx31f.js.map
