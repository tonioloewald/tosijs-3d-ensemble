import{i}from"./site-1yf4ncc8.js";var o="meshUboDeclaration",e=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;if(!i.IncludesShadersStore[o])i.IncludesShadersStore[o]=e;var Ki={name:o,shader:e};
export{Ki};

//# debugId=AC12F76A46BC4EEE64756E2164756E21
//# sourceMappingURL=site-343zg1tr.js.map
