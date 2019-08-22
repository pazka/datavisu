precision mediump float;

#ifndef iTime 
uniform float iTime;
#else
#define iTime 124578.0
#endif


#ifndef iResolution
#define iResolution vec2(1920,1080)
#endif


float noise(vec3 p)
{
	p = floor(p);
	p = fract(p*vec3(283.343, 251.691, 634.127));
	p += dot(p, p+23.453);
	return fract(p.x*p.y);
}
float noiseblend(vec3 p)
{
	vec2 off = vec2(1.,0.);
	return mix(	mix(	mix(noise(p), noise(p+off.xyy),fract(p.x)),
		   				mix(noise(p+off.yxy), noise(p+off.xxy),fract(p.x)),fract(p.y)),
			   	mix(	mix(noise(p+off.yyx), noise(p+off.xyx),fract(p.x)),
		   				mix(noise(p+off.yxx), noise(p+off.xxx),fract(p.x)),fract(p.y))
			   ,fract(p.z));
	
}
float turb(vec3 p)
{
	p *= 4.;
	vec3 dp = vec3(p.xy,p.z+iTime*.25);
	float inc = 0.75;
	float div = 1.75;
	vec3 octs = dp*2.13;
	float n = noiseblend(dp);
	for(float i=0.; i<5.; i++)
	{
		float ns = noiseblend(octs);
		n += inc*ns;
		
		octs *=2.+(vec3(ns,noiseblend(octs+vec3(n,0.,0.1)),0.));
		inc *=.5*n;
		div +=inc;
	}
	float v = n/div;
	v *= 1.-max(0.,3.8-length(vec3(.5,0.,6.)-p));
	return v;
}

void main( )
{
	// Normalized pixel coordinates (from -1 to 1)
	vec2 uv = (2.*gl_FragCoord.xy - iResolution.xy)/iResolution.y;
	vec2 mouse = vec2(0.5,0.5);

	uv *=1.+.2*length(uv);
	float uvlen = 1.-length(uv);
	float tt = .5*iTime+(0.3-.3*uvlen*uvlen);
	vec2 rot = vec2(sin(tt),cos(tt));
	uv = vec2(uv.x*rot.x+uv.y*rot.y, uv.x*rot.y-uv.y*rot.x);
	mouse = vec2(0.5,0.5);
	vec3 ro = vec3(mouse,-1.);
	vec3 rd = normalize(vec3(uv,5.)-ro);
	
	vec3 col = vec3(0);
	rd.z+=tt*.01;
	float nv = turb(rd);
	for(float i=0.; i<1.; i+=.2)
	{
		nv *=.5;
		nv = turb(vec3(rd.xy,rd.z+i));
		col += (1.5-i)*vec3(nv,nv*nv*(3.-2.*nv), nv*nv);
	}
	col /=5.;
	//bluerisation
	col *= vec3(0.1,0.2,2);
	
	gl_FragColor = vec4(col,1.);
}