import{TC as o}from"./site-qntg4d3x.js";var e="meshUboDeclaration",i=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;if(!o.IncludesShadersStore[e])o.IncludesShadersStore[e]=i;var t={name:e,shader:i};
export{t as Ez};

//# debugId=7AF66819911FE5CC64756E2164756E21
//# sourceMappingURL=site-g6w7j0j2.js.map
