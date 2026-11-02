import{je}from"./site-pddhyj91.js";import{Za}from"./site-e559s7b7.js";import{o}from"./site-8nsc0rx2.js";class vp extends Za{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",je)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}o("FlowGraphKeyDownEventBlock",vp);
export{vp};

//# debugId=BD337ACA5FBF208E64756E2164756E21
//# sourceMappingURL=site-ngrx3pgz.js.map
