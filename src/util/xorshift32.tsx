export class XorShift32{

    w:number;
    x:number=123456789;
    y:number=362436069;
    z:number=521288629;
    
    constructor(seed = 88675123) {
        this.w = seed;
    }

    rand=()=>{
        let t:number = this.x^(this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;

        return this.w = ( this.w ^ (this.w >>> 19) ) ^ ( t ^ (t >>> 8) ); 
    }

    randInt(min:number=0,max:number){
        return min+(Math.abs(this.rand()) % ( max+1 - min ));
    }
}