/**
 * Displays a list of 当堂课学生教学练习题
 */
Ext.define('Youngshine.view.teach.Topic', {
    extend: 'Ext.dataview.List',
	xtype: 'topic',

    //id: 'topicteachList',

    config: {
		parentRecord: null, //保存list选择的父表记录信息
		
		store: 'Topic',
        //itemHeight: 89,
        //emptyText: '空白',
		disableSelection: true,
		striped: true,
		/*
		itemTpl: '<div><img src="{pic_teach}" width=100% height=80 /></div>' + 
			'<div style="text-align:center;font-size:0.8em;color:green;">{fullDone}</div></div>',
		*/
		itemTpl: '<div>' + 
			'<div>{content}</div>' +
			'<div style="color:orangered;text-align:right;font-size:0.8em;">{fullDone}</div>'+
			'</div>',
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '自适应练习题',
			items: [{
				ui : 'back',
				action: 'back',
				text : '课时列表',
				//iconCls: 'team',
				handler: function(btn){
					btn.up('list').onBack() //返回
				}
			},{
				xtype: 'spacer'
			},{
				ui : 'confirm',
				action: 'test',
				text : '考试',
				hidden: true, //开始不可见，有添加题目才显示？
				//iconCls: 'add',
				handler: function(btn){
					btn.up('list').onTest()
				}		
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '<span class="fetch">＋添加练习题</span>'+
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<span class="photo">上传教学笔记</span>' + 
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<span class="pdf">PDF教案</span>',
			//itemId: 'zsd',
			style: 'text-align:center;color:green;margin:10px;'
/*		},{
    		xtype: 'toolbar',
    		docked: 'top',
			ui: 'plain', //layout
			
			items: [{
				xtype: 'spacer'
			},{
				ui : 'plain',
				action: 'fetch',
				text : '＋添加题目',
				style:'color:green;',
				handler: function(){
					//var view = Youngshine.app.getController('Teach').getStudent();
					//Ext.Viewport.add(view);	
					this.up('list').onFetch() //返回
				}
			},{
				xtype: 'spacer'	
			},{
				ui : 'plain',
				action: 'photo',
				text : '▣ 拍照',
				style:'color:green;',
				//hidden: true, //开始不可见，有添加题目才显示？
				//iconCls: 'add',
				handler: function(){
					this.up('list').onPhoto()
				}	
			},{
				xtype: 'spacer'	
			}] */	/*
		},{
    		xtype: 'button',
    		ui: 'plain',
			scrollDock: 'top',
			docked: 'top',
			text: '＋添加题目',
			style:'color:green;margin:10px;',
			handler: function(){
				this.up('list').onFetch()
			}
		},{
    		xtype: 'button',
    		ui: 'confirm',
			scrollDock: 'bottom',
			docked: 'bottom',
			text: '通过学习',
			style:'color:#fff;margin:10px;',
			action: 'pass',
			hidden: true,
			handler: function(){
				this.up('list').onPass()
			}	*/
    	}],
		
		listeners: [{
			element: 'element',
			delegate: 'span.fetch',
			event: 'tap',
			fn: 'onFetch'
		},{
			element: 'element',
			delegate: 'span.photo',
			event: 'tap',
			fn: 'onPhoto'	
		},{
			element: 'element',
			delegate: 'span.pdf',
			event: 'tap',
			fn: 'onPDF'
		}],
    },
	
	// 未做提，取原始level，做完题算平均分
	onFetch: function(){
		var me = this;
		
		var overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			width: 400,height: 480,
			scrollable: true,
			hidden: true,
			layout: 'fit',
			
			parentRecord: me.getParentRecord(), //传递父窗口参数：当前学生记录
			
	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '选择知识点',
				ui: 'light',
				items: [{
					xtype: 'spacer'
				},{
					text: '确定',
					ui: 'confirm',
					action: 'choose',
					disabled: true
				}]
			},{
				xtype: 'list',
				//disableSelection: true,
			    itemTpl: '{title}',
			    data: [
			        { title: '一次方程' },
			        { title: '二次方程式' },
			        { title: '圆形' },
			        { title: '立体' },
			    ],
			}],	
			
			listeners: [{
				delegate: 'list',
				event: 'select',
				fn: function( list, record){ 
					console.log(record)
					var btnChoose = list.up('panel').down('button[action=choose]')
					btnChoose.setDisabled(false)
					btnChoose.on('tap',function(){
						alert('choose')
					})
				}
			}]
		})
		overlay.show()
		return
		
		var done = 0, //做完一组题对水平，以便自适应推题
			store = me.getStore()

		if(store.getCount()>99){
			Ext.toast('练习已超过99题',3000);
			return false
		}
		
		// 学科数理化123，对应level_list数组012
		var subjectID = parseInt(me.getRecord().data.subjectID)-1;
		//学生报名的原始水平1、2、3列表，不同学科subjectID？？？
		var level = me.getRecord().data.level_list.split(',')[subjectID];
		console.log(level)
		
		for(var i=0;i<store.getCount();i++){
			if(store.getAt(i).get('done')==0){
				Ext.toast('当前题目未做完',3000);
				return false
			}
			done += parseInt( store.getAt(i).get('done') )
		}
		
		// 已经做题
		if(done > 0) 
			level = Math.floor( done/(store.getCount()) ); //得出做题平均分parseInt

    	Ext.Msg.confirm('添加练习题',"随机添加5个自适应题目？",function(btn){	
			if(btn == 'yes'){
				var obj = {
					"level": level,//该学科难度
					"zsdID": me.getRecord().data.zsdID,
					"subjectID": me.getRecord().data.subjectID,//知识点按学科分表
					"studentstudyID": me.getRecord().data.studentstudyID,
					"courseID": me.getRecord().data.courseID
				}	
				console.log(obj)
				me.fireEvent('fetchTopic',obj)
			}
		});
		

	},
	// 返回
	onBack: function(){
		this.fireEvent('back',this)
	},
	
	onPDF: function(){
		this.fireEvent('pdf',this.getRecord(),this)
	},
	
	// 拍照教学过程
	onPhoto: function(){
		//Ext.Msg.alert('Shoot Photos');
		this.fireEvent('photos', this.getRecord(), this)
		//return
		/*
		var view = Ext.create('Youngshine.view.teach.Topic-teach-photos')
		view.setOldView(this);
		
		Ext.Viewport.add(view)
		Ext.Viewport.setActiveItem(view) */		
	},

	// 做对10题，才能考试
	onTest: function(){
		var me = this;
		var store = me.getStore(),
			count = 0;
		for(var i=0;i<store.getCount();i++){
			if(store.getAt(i).get('done')==3) count += 1	
		}
		if(count<9){
			Ext.toast('未做对10题',3000);return
		} 
		this.fireEvent('test', this.getRecord(), this)
	},	
	// 做对（2，3）十题，可以通过
	onPass: function(){
		var me = this;
		var store = me.getStore(),
			count = 0;
		for(var i=0;i<store.getCount();i++){
			if(store.getAt(i).get('done')==3) count += 1	
		}
		if(count<9){
			Ext.Msg.alert('未做对10题');
			return false
		} 
		
		//list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '通过本知识点学习？',
				ui: 'confirm',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					me.fireEvent('pass', 1,me.getRecord(),me);
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					//list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
	},
	
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
    },   
    onElSwipe : function(e) {
        console.log(e.target)
		var me = this;
		//if(e.target.className != "prodinfo") // 滑动商品名称等panel才退回
		//	return
		if(e.direction=='right'){
			me.onBack();
        };     
    }, 
});
