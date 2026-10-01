import{Ye}from"./site-j8hq6r34.js";import{Qa}from"./site-ncrhvtgk.js";import{o}from"./site-jx9g7gwh.js";class fp extends Qa{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",Ye)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}o("FlowGraphKeyDownEventBlock",fp);
export{fp};

//# debugId=04A1221269B3D9F464756E2164756E21
//# sourceMappingURL=site-nvgqhqbz.js.map
