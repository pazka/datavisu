// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// lets get texcoords just for fun! 
varying vec2 vTexCoord;

void main() {
  // copy the texcoords
  vTexCoord = aTexCoord;

  // copy the position data into a vec4, using 1.0 as the w component
  vec3 positionVec4 = aPosition * 2.0 - 1.0;

  // send the vertex information on to the fragment shader
  gl_Position = vec4(positionVec4,1.0);
}