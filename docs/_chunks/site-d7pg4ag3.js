import{zs as i}from"./site-efy4jtqr.js";import{Gs as u}from"./site-gs6exbj3.js";import{Pu as s,Ru as h}from"./site-y0mephjk.js";import{lF as o}from"./site-54y5gp1n.js";class p extends u{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",h),this.targetMesh=this.registerDataInput("targetMesh",s,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",s)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&i(e.mesh,r))&&(e.mesh===r||i(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var n=!1;function m(){if(n)return;n=!0,o("FlowGraphPointerOutEventBlock",p)}m();
export{p as Un,m as Vn};

//# debugId=337305EDE6E34D7064756E2164756E21
//# sourceMappingURL=site-d7pg4ag3.js.map
