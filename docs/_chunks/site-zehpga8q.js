import{RC as e}from"./site-eq33q5cn.js";var o="vertexColorMixing",d=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
vColor=vec4(1.0);
#ifdef VERTEXCOLOR
#ifdef VERTEXALPHA
vColor*=colorUpdated;
#else
vColor.rgb*=colorUpdated.rgb;
#endif
#endif
#ifdef INSTANCESCOLOR
vColor*=instanceColor;
#endif
#endif
`;if(!e.IncludesShadersStore[o])e.IncludesShadersStore[o]=d;var i={name:o,shader:d};
export{i as Hz};

//# debugId=463D592789D8C3DD64756E2164756E21
//# sourceMappingURL=site-zehpga8q.js.map
