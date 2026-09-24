import{TC as e}from"./site-qntg4d3x.js";var o="vertexColorMixing",d=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
export{i as Jz};

//# debugId=4BFF88CE72C8144364756E2164756E21
//# sourceMappingURL=site-4qpva6fd.js.map
