import{Hr as l}from"./site-kxa41wgv.js";import{Nu as s,Ou as u}from"./site-p0rrvqfa.js";import{jF as a}from"./site-6873nq4n.js";class n extends l{constructor(e){super(s,e);this.config=e,this.object=this.registerDataInput("object",s,e.object),this.propertyName=this.registerDataInput("propertyName",u,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",s)}_doOperation(e){let o=this.customGetFunction.getValue(e),r;if(o)r=o(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),p=this.propertyName.getValue(e);r=t&&p?this._getPropertyValue(t,p):void 0}return r}_getPropertyValue(e,o){let r=o.split("."),t=e;for(let p of r)if(t=t[p],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function h(){if(i)return;i=!0,a("FlowGraphGetPropertyBlock",n)}h();
export{n as kp,h as lp};

//# debugId=45DA08EB4E74BEBE64756E2164756E21
//# sourceMappingURL=site-ee7nwnb1.js.map
