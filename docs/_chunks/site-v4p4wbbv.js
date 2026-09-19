import{xs as i}from"./site-3fcadxwq.js";import{Es as u}from"./site-r11vn21v.js";import{Nu as s,Pu as h}from"./site-p0rrvqfa.js";import{jF as o}from"./site-6873nq4n.js";class p extends u{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",h),this.targetMesh=this.registerDataInput("targetMesh",s,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",s)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&i(e.mesh,r))&&(e.mesh===r||i(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var n=!1;function m(){if(n)return;n=!0,o("FlowGraphPointerOutEventBlock",p)}m();
export{p as Sn,m as Tn};

//# debugId=A7B84366A93D36D964756E2164756E21
//# sourceMappingURL=site-v4p4wbbv.js.map
