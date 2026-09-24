import{TC as e}from"./site-qntg4d3x.js";var t="morphTargetsVertexDeclaration",i=`#ifdef MORPHTARGETS
#ifndef MORPHTARGETS_TEXTURE
#ifdef MORPHTARGETS_POSITION
attribute vec3 position{X};
#endif
#ifdef MORPHTARGETS_NORMAL
attribute vec3 normal{X};
#endif
#ifdef MORPHTARGETS_TANGENT
attribute vec3 tangent{X};
#endif
#ifdef MORPHTARGETS_UV
attribute vec2 uv_{X};
#endif
#ifdef MORPHTARGETS_UV2
attribute vec2 uv2_{X};
#endif
#ifdef MORPHTARGETS_COLOR
attribute vec4 color{X};
#endif
#elif {X}==0
uniform float morphTargetCount;
#endif
#endif
`;if(!e.IncludesShadersStore[t])e.IncludesShadersStore[t]=i;var r={name:t,shader:i};
export{r as Uy};

//# debugId=132D1EC5ACEBDE5F64756E2164756E21
//# sourceMappingURL=site-fc9nq7ky.js.map
