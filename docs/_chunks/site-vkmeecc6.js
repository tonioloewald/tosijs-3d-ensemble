import{qE as s}from"./site-9egbbhtn.js";class n{static GetEffect(e){return e.getPipelineContext===void 0?e.effect:e}constructor(e,t=!0){if(this._wasPreviouslyReady=!1,this._forceRebindOnNextCall=!0,this._wasPreviouslyUsingInstances=null,this.effect=null,this.defines=null,this.drawContext=e.createDrawContext(),t)this.materialContext=e.createMaterialContext()}setEffect(e,t,i=!0){if(this.effect=e,t!==void 0)this.defines=t;if(i)this.drawContext?.reset()}dispose(e=!1){if(this.effect){let t=this.effect;if(e)t.dispose();else s.SetImmediate(()=>{t.getEngine().onEndFrameObservable.addOnce(()=>{t.dispose()})});this.effect=null}this.drawContext?.dispose()}}
export{n as DB};

//# debugId=02927A16F566FDA064756E2164756E21
//# sourceMappingURL=site-vkmeecc6.js.map
