import{Cc}from"./site-hvz3dztr.js";import{Bu}from"./site-n6jyfa5c.js";class Dv extends Cc{constructor(e,t){super(e,t)}}class ip extends Dv{constructor(e,t){super(e,t);this._subGraph=new ip._SubGraph(this)}async _initAsync(e){if(await this._subGraph.initAsync(e),this.engine.mainOut){if(!this._connect(this.engine.mainOut))throw Error("Connect failed")}this.engine._addMainBus(this)}dispose(){super.dispose(),this.engine._removeMainBus(this)}get _inNode(){return this._subGraph._inNode}get _outNode(){return this._subGraph._outNode}_connect(e){if(!super._connect(e))return!1;if(e._inNode)this._outNode?.connect(e._inNode);return!0}_disconnect(e){if(!super._disconnect(e))return!1;if(e._inNode)this._outNode?.disconnect(e._inNode);return!0}getClassName(){return"_WebAudioMainBus"}}ip._SubGraph=class extends Bu{get _downstreamNodes(){return this._owner._downstreamNodes??null}};
export{Dv,ip};

//# debugId=10AC07FBC6B6A3AE64756E2164756E21
//# sourceMappingURL=site-yx5w04md.js.map
