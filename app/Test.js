{
	id:3,
	name:"Test",
	frameRate:20,
	start:function(){
		
	},
	x:0,
	drawGui:function(canvas,paint){
		canvas.drawLine(0,15,this.x,15,paint);
		this.x++;
		if(this.x==32) this.x =0;
	},
	keyEvent:function(keyWord){
		
	},
	end:function(){
	}
}