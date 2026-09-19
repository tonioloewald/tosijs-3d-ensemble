import{xs as i}from"./site-3fcadxwq.js";import{Es as p}from"./site-r11vn21v.js";import{Nu as s,Pu as h}from"./site-p0rrvqfa.js";import{jF as o}from"./site-6873nq4n.js";class u extends p{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",h),this.targetMesh=this.registerDataInput("targetMesh",s,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",s)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let m=t.out&&i(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!m&&(t.mesh===r||i(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var n=!1;function a(){if(n)return;n=!0,o("FlowGraphPointerOverEventBlock",u)}a();
export{u as Qn,a as Rn};

//# debugId=B35A14905C8F451F64756E2164756E21
//# sourceMappingURL=site-jfv4xfge.js.map
