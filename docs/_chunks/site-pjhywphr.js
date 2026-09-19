import{RC as r}from"./site-eq33q5cn.js";var e="fluidRenderingParticleThicknessPixelShader",a=`uniform float particleAlpha;varying vec2 uv;void main(void) {vec3 normal;normal.xy=uv*2.0-1.0;float r2=dot(normal.xy,normal.xy);if (r2>1.0) discard;float thickness=sqrt(1.0-r2);glFragColor=vec4(vec3(particleAlpha*thickness),1.0);}
`;if(!r.ShadersStore[e])r.ShadersStore[e]=a;var o={name:e,shader:a};
export{o as Fg};

//# debugId=B54EB311CC88C43864756E2164756E21
//# sourceMappingURL=site-pjhywphr.js.map
