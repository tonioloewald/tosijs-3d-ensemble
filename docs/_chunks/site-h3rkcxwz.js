import{RC as r}from"./site-eq33q5cn.js";var e="fluidRenderingParticleDiffusePixelShader",o=`uniform float particleAlpha;varying vec2 uv;varying vec3 diffuseColor;void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;glFragColor=vec4(diffuseColor,1.0);}
`;if(!r.ShadersStore[e])r.ShadersStore[e]=o;var a={name:e,shader:o};
export{a as xg};

//# debugId=5604F41066DD1E6E64756E2164756E21
//# sourceMappingURL=site-h3rkcxwz.js.map
