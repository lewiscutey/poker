$(function(){
//红桃:H 黑桃:S 梅花:C 方块:D

// 得分显示
var grade = $('.scene .btnRight .grade span');
var grades = 0;

// 时间显示
var time = $('.scene .btnRight .time span');
var times = 0;
var t = null;
function getTime(){
	time.text(''+gettime(times+=1)+'秒');
}

function gettime(time){
	if(isNaN(time)){
	    return '--:--';
	};
	var min=Math.floor(time/60);
	var sec=parseInt(time%60);
	if(sec<10){
	    sec='0'+sec
	}
	if(min<10){
	    min='0'+min
	}
	return min+':'+sec;
};

// 剩余配对
var pair = $('.scene .btnRight .pair span');
var pairs = 28;

// 创造了一副牌
function makePoker(){
	var poker = [];
	var colors = ['h','s','c','d'];
	var table = {};
	
	// 把图片放到poker数组中
	while(poker.length!==52){
		var n = Math.ceil(Math.random()*13);
		var c = colors[Math.floor(Math.random()*4)];
		var v = {
			color:c,
			number:n
		};
		
	    if(!table[c+n]){
		 	poker.push(v);
		 	table[c+n] = true;
	    }
		
	}
	grade.text(grades = 0);
	pair.text(pairs = 28);
	clearInterval(t);
	time.text(''+(times=0)+'秒');
	counts = 0;
	return poker;
}

// 开始页面时把牌放到页面中
function endPoker(poker){
	// 遍历poker数组把图片放到页面中
	var dict = {
		1:'A',
		2:'2',
		3:'3',
		4:'4',
		5:'5',
		6:'6',
		7:'7',
		8:'8',
		9:'9',
		10:'T',
		11:'J',
		12:'Q',
		13:'K',
	};
	var index = 0;
	for (var j = 0; j < poker.length; j++) {
		pokers = poker[index];
		index += 1;
		$('<div>').addClass('pai')
		 	  .css('background-image','url(images/'+dict[pokers.number]+pokers.color+'.png)')
		 	  .appendTo($('.scene'))
		 	  .animate({opacity:1});
	};
}
endPoker(makePoker());

// 把牌随机遍历发散到页面中
function setPoker(poker){
	// 遍历poker数组把图片放到页面中
	var dict = {
		1:'A',
		2:'2',
		3:'3',
		4:'4',
		5:'5',
		6:'6',
		7:'7',
		8:'8',
		9:'9',
		10:'T',
		11:'J',
		12:'Q',
		13:'K',
	};
	var index = 0;
	for (var i = 0; i < 7; i++) {
		for (var j = 0; j < i+1; j++) {
			pokers = poker[index];
			index += 1;
			$('<div>').addClass('pai')
				  .attr('id',i+'_'+j)
				  .attr('data_num',pokers.number)
			 	  .css('background-image','url(images/'+dict[pokers.number]+pokers.color+'.png)')
			 	  .appendTo($('.scene'))
			 	  .delay(index*30)
			 	  .animate({top:i*35,left:(6-i)*73+j*147,opacity:1});
		};
	};

	for (; index < poker.length; index++) {
		pokers = poker[index];
		$('<div>').addClass('pai left')
			  .attr('data_num',pokers.number)
		 	  .css('background-image','url(images/'+dict[pokers.number]+pokers.color+'.png)')
		 	  .appendTo($('.scene'))
		 	  .delay(index*30)
		 	  .animate({top:400,left:220,opacity:1});
	};
	t = setInterval(getTime,1000);
}

// 开始游戏按钮
$('.scene .btn .start').on('click',function(){
	$('.pai').remove();
	setPoker(makePoker());
});

// 重新开始游戏按钮
$('.scene .btn .startrep').on('click',function(){
	$('.pai').remove();
	setPoker(makePoker());
});

// 结束游戏按钮
$('.scene .btn .end').on('click',function(){
	// location.reload();
	$('.pai').remove();
	endPoker(makePoker());
});
 
// 右移按钮
var moveRight = $('.scene .move .moveRight');
moveRight.on('click',(function(){
	var zIndex = 1;
	return function(){
		if($('.left').length){
		$('.left').last()
				  .css('z-index',zIndex++)
				  .delay(50)
				  .animate({top:400,left:660})
				  .queue(function(){
				     	$(this).addClass('right')
				   		       .removeClass('left')
				   		       .dequeue();
				});
		}else{
			return;
		}
	};
})());

// 左移按钮
var moveleft = $('.scene .move .moveleft');
var counts = 0;
moveleft.on('click',(function(){
	return function(){
		if($('.left').length!==0){
			alert('左边的图片必须全部移到右边才可以左移！');
			return;
		}else if(counts>2){
			alert('右移按钮只可以触发三次！');
			return;
		}else{
			$('.right').each(function(i,v){
				$(this).css('z-index',0)
				  	   .delay(i*50)
			           .animate({top:400,left:220})
			           .queue(function(){
			     	   $(this).removeClass('right')
			   		          .addClass('left')
			   		          .dequeue();
					    });
			});
		}
		counts++;
	};
})());

// 点击的第一张牌
var prev = null;

// 获取这张牌的数字
function getNumber(el){
	return parseInt(el.attr('data_num'));
}

// 检测这张牌是否可以点击
function isCanClick(el){
	var x = parseInt(el.attr('id').split('_')[0]);
	var y = parseInt(el.attr('id').split('_')[1]);
	if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){
		return false;
	}else{
		return true;
	}
}

// 事件委托 点击每张牌消除K
$('.scene').on('click','.pai',function(){
	if($(this).attr('id')&&!isCanClick($(this))){
		return;
	}
	var num = getNumber($(this));
	if(num==13){
		$(this).animate({top:-100,opacity:0})
			   .queue(function(){
			   	$(this).detach().dequeue();
			   });
		grade.text(grades+=5);
		pair.text(pairs-=1);
		if(pairs<0){
			alert('恭喜您！游戏胜利了！！！');
		}
		return;
	}else{
		$(this).animate({top:'-=20'});
		if(prev){
			if((getNumber(prev)+getNumber($(this)))==13){
				prev.add($(this))
					.animate({top:-100,opacity:0})
					.queue(function(){
			   		$(this).detach().dequeue();
			  		});
			  	grade.text(grades+=3);
			  	pair.text(pairs-=1);
			  	if(pairs<0){
					alert('恭喜您！游戏胜利了！！！');
				}
			}else{
				$(this).queue(function(){
					$(this).animate({top:'+=20'})
						   .dequeue();
				});
				prev.delay(400)
					.animate({top:'+=20'});
			}
			prev = null;
		}else{
			prev = $(this);
		}
		
	}
});







});
// 函数在定义的时候会纪录自己可见范围内的所有变量
// 只记录地址，不记录值
// 记录的顺序是由近及远
// 所有的纪录组成一个链条，叫做函数的作用域链
// 函数在调用的时候会查看作用域链
// js中函数的这个特性导出闭包这个概念
// 闭包通常用来构造一个更强大的函数
// 或者用来获取一些中间状态的值

// jquery中回调函数中的this大部分情况下是指向集合中的一个DOM元素
// 1.arguments   2.this指向