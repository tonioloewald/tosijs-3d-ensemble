import{zs as i}from"./site-efy4jtqr.js";import{Gs as p}from"./site-gs6exbj3.js";import{Pu as s,Ru as h}from"./site-y0mephjk.js";import{lF as o}from"./site-54y5gp1n.js";class u extends p{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",h),this.targetMesh=this.registerDataInput("targetMesh",s,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",s)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let m=t.out&&i(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!m&&(t.mesh===r||i(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var n=!1;function a(){if(n)return;n=!0,o("FlowGraphPointerOverEventBlock",u)}a();
export{u as Sn,a as Tn};

//# debugId=6226C71B4DF18E6464756E2164756E21
//# sourceMappingURL=site-b2zm256f.js.map
