import{Gr,ci}from"./site-0215gf70.js";import{w,N}from"./site-afz29jnp.js";import{o}from"./site-ky7rmxkt.js";class Zp extends ci{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",w,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",w)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&Gr(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||Gr(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function Kp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Zp)}Kp();
export{Zp,Kp};

//# debugId=430613643DDF96EA64756E2164756E21
//# sourceMappingURL=site-btcraveq.js.map
