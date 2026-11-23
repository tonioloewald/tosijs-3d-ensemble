import{be}from"./site-bs4qmp9a.js";import{R,je}from"./site-f6qdnbcs.js";import{o,e,l}from"./site-3cxcjhqf.js";class tg extends be{constructor(t){super(t);this.sourceSystem=this.registerDataInput("sourceSystem",R),this.destinationSystem=this.registerDataInput("destinationSystem",R),this.inputCoordinates=this.registerDataInput("inputCoordinates",je),this.outputCoordinates=this.registerDataOutput("outputCoordinates",je)}_updateOutputs(t){let a=this.sourceSystem.getValue(t),n=this.destinationSystem.getValue(t),u=this.inputCoordinates.getValue(t),p=a.getWorldMatrix(),m=n.getWorldMatrix(),s=l.Matrix[0].copyFrom(m);s.invert();let r=l.Matrix[1];s.multiplyToRef(p,r);let d=this.outputCoordinates.getValue(t);e.TransformCoordinatesToRef(u,r,d)}getClassName(){return"FlowGraphTransformCoordinatesSystemBlock"}}var i=!1;function ig(){if(i)return;i=!0,o("FlowGraphTransformCoordinatesSystemBlock",tg)}
export{tg,ig};

//# debugId=F7BDEA90824BD77164756E2164756E21
//# sourceMappingURL=site-mexk4dds.js.map
