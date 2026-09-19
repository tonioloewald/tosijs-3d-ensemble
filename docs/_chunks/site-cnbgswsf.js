import{RC as o}from"./site-eq33q5cn.js";var e="meshUboDeclaration",i=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;if(!o.IncludesShadersStore[e])o.IncludesShadersStore[e]=i;var t={name:e,shader:i};
export{t as Cz};

//# debugId=F930CC6010B1E92F64756E2164756E21
//# sourceMappingURL=site-cnbgswsf.js.map
