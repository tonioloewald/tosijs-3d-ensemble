import{i}from"./site-1yf4ncc8.js";var e="logDepthVertex",t=`#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`;if(!i.IncludesShadersStore[e])i.IncludesShadersStore[e]=t;var tt={name:e,shader:t};
export{tt};

//# debugId=81205F1D4BC30D8964756E2164756E21
//# sourceMappingURL=site-09wj8me1.js.map
