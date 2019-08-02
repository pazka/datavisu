
class Storm{
  octaves = 1;
  falloff = 0.75;

  noiseVal;
  //Increment x by 0.01
  x_increment = 0.01;
  y_increment = 0.01;
  //Increment z by 0.02 every draw() cycle
  z_increment = 0.02;

  //Offset values
  z_off = 0
  y_off
  x_off

  draw(p) {/*
    this.x_off = 0;
    this.y_off = 0;

    //Adjust the noice detail
    p.noiseDetail(this.octaves, this.falloff);

    //For each x,y calculate noice value
    for (let y = 0; y < p.height; y++) {
      this.x_off += this.x_increment;
      this.y_off = 0;

      for (let x = 0; x < p.width; x++) {
        //Calculate and Draw each pixel
        this.noiseVal = p.noise(this.x_off, this.y_off, this.z_off);
        p.stroke(this.noiseVal * 255);
        this.y_off += this.y_increment;
        p.point(x, y);
      }
    }

    this.z_off += this.z_increment;*/
  }
}