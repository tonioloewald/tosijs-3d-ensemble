import{RC as e}from"./site-eq33q5cn.js";var t="logDepthVertex",o=`#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`;if(!e.IncludesShadersStore[t])e.IncludesShadersStore[t]=o;var n={name:t,shader:o};
export{n as Az};

//# debugId=8797530592AE68D764756E2164756E21
//# sourceMappingURL=site-2qj3m9e3.js.map
