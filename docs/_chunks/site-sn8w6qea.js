import{TC as r}from"./site-qntg4d3x.js";var e="fluidRenderingParticleDiffusePixelShader",o=`uniform float particleAlpha;varying vec2 uv;varying vec3 diffuseColor;void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;glFragColor=vec4(diffuseColor,1.0);}
`;if(!r.ShadersStore[e])r.ShadersStore[e]=o;var a={name:e,shader:o};
export{a as zg};

//# debugId=557B0094F5C8B39064756E2164756E21
//# sourceMappingURL=site-sn8w6qea.js.map
