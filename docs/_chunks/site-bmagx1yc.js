import{be}from"./site-3s1j98fr.js";import{A,je}from"./site-2m9hnh4q.js";import{o,e,l}from"./site-ny31phz1.js";class t_ extends be{constructor(t){super(t);this.sourceSystem=this.registerDataInput("sourceSystem",A),this.destinationSystem=this.registerDataInput("destinationSystem",A),this.inputCoordinates=this.registerDataInput("inputCoordinates",je),this.outputCoordinates=this.registerDataOutput("outputCoordinates",je)}_updateOutputs(t){let a=this.sourceSystem.getValue(t),n=this.destinationSystem.getValue(t),u=this.inputCoordinates.getValue(t),p=a.getWorldMatrix(),m=n.getWorldMatrix(),s=l.Matrix[0].copyFrom(m);s.invert();let r=l.Matrix[1];s.multiplyToRef(p,r);let d=this.outputCoordinates.getValue(t);e.TransformCoordinatesToRef(u,r,d)}getClassName(){return"FlowGraphTransformCoordinatesSystemBlock"}}var i=!1;function i_(){if(i)return;i=!0,o("FlowGraphTransformCoordinatesSystemBlock",t_)}
export{t_,i_};

//# debugId=AC04471A6FFC6AD564756E2164756E21
//# sourceMappingURL=site-bmagx1yc.js.map
