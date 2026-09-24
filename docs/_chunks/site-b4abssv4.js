import{TC as e}from"./site-qntg4d3x.js";var t="logDepthVertex",o=`#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`;if(!e.IncludesShadersStore[t])e.IncludesShadersStore[t]=o;var n={name:t,shader:o};
export{n as Cz};

//# debugId=2C1F86F82F6C7F2A64756E2164756E21
//# sourceMappingURL=site-b4abssv4.js.map
