import{TC as r}from"./site-qntg4d3x.js";var e="fluidRenderingParticleThicknessPixelShader",a=`uniform float particleAlpha;varying vec2 uv;void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;float thickness=sqrt(1.0-r2);glFragColor=vec4(vec3(particleAlpha*thickness),1.0);}
`;if(!r.ShadersStore[e])r.ShadersStore[e]=a;var o={name:e,shader:a};
export{o as Hg};

//# debugId=0129963EE773956964756E2164756E21
//# sourceMappingURL=site-x3vepmdp.js.map
