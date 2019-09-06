// our vertex data
attribute vec3 aPosition;

void main() {

  // copy the position data into a vec4, using 1.0 as the w component
  vec3 positionVec4 = aPosition *  2.0 - 1.;

  // send the vertex information on to the fragment shader
  gl_Position = vec4(positionVec4,1.0);
}