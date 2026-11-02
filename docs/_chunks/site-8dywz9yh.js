import{R,Li}from"./site-pddhyj91.js";import{Ri}from"./site-pt4ffkpb.js";import{o}from"./site-8nsc0rx2.js";class dm extends Ri{constructor(e){super(R,e);this.config=e,this.object=this.registerDataInput("object",R,e.object),this.propertyName=this.registerDataInput("propertyName",Li,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",R)}_doOperation(e){let p=this.customGetFunction.getValue(e),r;if(p)r=p(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),s=this.propertyName.getValue(e);r=t&&s?this._getPropertyValue(t,s):void 0}return r}_getPropertyValue(e,p){let r=p.split("."),t=e;for(let s of r)if(t=t[s],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function pm(){if(i)return;i=!0,o("FlowGraphGetPropertyBlock",dm)}pm();
export{dm,pm};

//# debugId=CA4E6C73C72BF58F64756E2164756E21
//# sourceMappingURL=site-8dywz9yh.js.map
