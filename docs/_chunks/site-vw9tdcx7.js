import{He}from"./site-f6qdnbcs.js";import{Ql}from"./site-z5f0z64t.js";import{o}from"./site-3cxcjhqf.js";class l_ extends Ql{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",He)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}var s=!1;function c_(){if(s)return;s=!0,o("FlowGraphKeyDownEventBlock",l_)}
export{l_,c_};

//# debugId=17B3D0E424EF537264756E2164756E21
//# sourceMappingURL=site-vw9tdcx7.js.map
