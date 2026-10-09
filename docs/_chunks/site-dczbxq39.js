import{i}from"./site-1yf4ncc8.js";var o="meshUboDeclaration",e=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;if(!i.IncludesShadersStore[o])i.IncludesShadersStore[o]=e;var er={name:o,shader:e};
export{er};

//# debugId=557595B5021EA0B164756E2164756E21
//# sourceMappingURL=site-dczbxq39.js.map
