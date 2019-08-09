   
// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;


void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = positionVec4;
}