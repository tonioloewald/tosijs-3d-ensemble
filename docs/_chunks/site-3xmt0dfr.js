import{Wn as a}from"./site-h6ryeyvh.js";import{Qu as o}from"./site-p0rrvqfa.js";import{jF as s}from"./site-6873nq4n.js";class p extends a{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",o)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}s("FlowGraphKeyDownEventBlock",p);
export{p as Un};

//# debugId=1D7D1A813B45913864756E2164756E21
//# sourceMappingURL=site-3xmt0dfr.js.map
