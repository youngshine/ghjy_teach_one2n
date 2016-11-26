/**
 * Displays a list of 当堂课学生教学练习题
 */
Ext.define('Youngshine.view.teach.Topic', {
    extend: 'Ext.dataview.List',
	xtype: 'topic',

    //id: 'topicteachList',

    config: {
		parentRecord: null, //保存list选择的父表记录信息
		parentView: null,
		
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
			'<div style="color:#888;font-size:0.9em;"><span>题目{gid}</span>' +
			'<span class="answer" style="color:green;float:right;">{fullDone}</span></div>'+
			'<div>{content}</div>' +
			'</div>',
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '自适应练习题',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
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
		var level = 2, // 默认出题题目难度
			done = 0 // 做题成绩0123
		var store = me.getStore();
		
		for(var i=0;i<store.getCount();i++){
			if(store.getAt(i).get('done')==0){
				Ext.toast('当前题目未做完',3000); 
				return false
			}
			done += parseInt( store.getAt(i).get('done') )
		}
		// 已经做题，根据成绩计算要出题的难度level
		if(done > 0) level = Math.floor( done/(store.getCount()) ); //得出做题平均分parseInt
		
		var overlay = Ext.Viewport.add({
			xtype: 'panel', itemId: 'modalZsd',
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			width: 500,
			//scrollable: true,
			hidden: true,
			layout: 'vbox',
			
			parentRecord: me.getParentRecord(), //传递父窗口参数：当前学生记录
			
	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '添加5个练习题',
				ui: 'light',
				items: [{
					text: '确定',
					ui: 'confirm',
					action: 'ok',
					disabled: true,
					handler: function(btn){
						//btn.up('panel[itemId=modalZsd]').onOk(btn) // build后不行
						getTopic()
					}
				}]
			},{
				xtype: 'fieldset',
				//width: 400,
				defaults: {
					labelWidth: 80,
					autoSelect: false,
				},
				items: [{
					xtype: 'selectfield',
					label: '年级',
					itemId: 'grade',
					displayField: 'text',
					valueField: 'value',
					value: me.getParentRecord().data.gradeID, //defalut
	                options: [
	                    {text: '九年级',  value: 9},
	                    {text: '八年级', value: 8},
	                    {text: '七年级',  value: 7},
						{text: '六年级',  value: 6},
	                    {text: '五年级',  value: 5},
	                    {text: '四年级', value: 4},
	                    {text: '三年级',  value: 3},
	                    {text: '二年级',  value: 2},
	                    {text: '一年级', value: 1},
	                ],
					autoSelect: false, 	
					defaultPhonePickerConfig: {
						doneButton: '确定',
						cancelButton: '取消'
					},
					listeners: {
						change: function(){
							var panel = this.up('panel[itemId=modalZsd]')
							console.log('grade change')
							panel.down('selectfield[itemId=zsd]').setDisabled(false)
							panel.down('selectfield[itemId=zsd]').reset();
							panel.down('button[action=ok]').setDisabled(true);
							//加载对应的知识点
							var obj = {
								subjectID : me.getParentRecord().data.subjectID,
								gradeID : this.getValue()
							}	
							getZsd(obj)
						},					
					},
				},{
					xtype: 'selectfield',
					label: '知识点', //选择后本地缓存，方便下次直接获取
					labelWidth: 80,
					itemId: 'zsd',
					//id: 'mySchool',
					displayField: 'zsdName',
					valueField: 'zsdID',
					store: 'Zsd',
					autoSelect: false, 	
					defaultPhonePickerConfig: {
						doneButton: '确定',
						cancelButton: '取消'
					},
					listeners: {
						change: function(field,newValue){
							console.log(newValue)
							if(newValue != null )
								this.up('panel').down('button[action=ok]').setDisabled(false);
						},					
					},
				},{
					xtype: 'selectfield',
					label: '难度',
					itemId: 'level',
					valueField: 'value',
					displayField: 'text',
	                options: [
	                    {text: '低',  value: 1},
	                    {text: '中', value: 2},
	                    {text: '高',  value: 3}
	                ]
				}]
			}],	
			
			onOk: function(btn){
				btn.setDisabled(true); //避免重复tap
				
				var level = btn.up('panel').down('selectfield[itemId=level]').getValue(),
					zsdID = btn.up('panel').down('selectfield[itemId=zsd]').getValue(),
					subjectID = me.getParentRecord().data.subjectID,
					courseNo = me.getParentRecord().data.courseNo
				
				Ext.Viewport.setMasked({xtype:'loadmask',message:'添加自适应题目'});
				
				var obj = {
					"level"    : level,
					"zsdID"    : zsdID,
					"subjectID": subjectID,
					"courseNo" : courseNo,
				}
				console.log(obj)
				
				Ext.data.JsonP.request({
				    url: Youngshine.app.getApplication().dataUrl + 'createOne2nTopic.php',
				    params: {
						data: JSON.stringify(obj)
				    },
					callbackKey: 'callback',
					//timeout: 9000,
				    success: function(result){
						console.log(result)
						Ext.getStore('Topic').load(); //reload .insert(0,result.data)
						//setTimeout(me.overlay.destroy(), 3000 )
						setTimeout(function(){ //延迟，才能滚动到最后4-1
							//me.overlay.destroy();
							overlay.destroy();
						},100);
						Ext.Viewport.setMasked(false)
				    }
				});
			},
		})
		
		overlay.show()
		//Ext.Viewport.add(overlay)
		
		// 计算当前5练习题的成绩，智能推出难度题目，默认2中
		overlay.down('selectfield[itemId=level]').setValue(level)
		
		// default 默认的当前练习题目的知识点，如果没有练习题，则无知识点默认值
		if(store.getCount() > 0){			
			// 手动设置知识点选择项
			var zsdID = store.getData().getAt(0).get('zsdID'),
				zsdName = store.getData().getAt(0).get('zsdName')
			selectbox = overlay.down('selectfield[itemId=zsd]')
			selectbox.setOptions([
				{zsdID: zsdID, zsdName: zsdName}
			])
			selectbox.setValue(zsdID)
			console.log(selectbox.getValue())		
		}
		
		// defalut 默认的年级学科（来自抱牍一对多课程）
		var obj = {
			subjectID : me.getParentRecord().data.subjectID,
			gradeID : me.getParentRecord().data.gradeID
		}
		getZsd(obj)
		
		// 获得某个年级学科的知识点, 公用
		function getZsd(obj){
			console.log(obj)
			var storeZsd = Ext.getStore('Zsd'); 
			storeZsd.removeAll(true)
			storeZsd.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
				'readZsdList.php?data='+JSON.stringify(obj) );
			storeZsd.load({ //异步async
				callback: function(records, operation, success){
					if (success){
						console.log(records[0])
					};
				}   		
			});
		}
		
		function getTopic(){
			overlay.down('button[action=ok]').setDisabled(true); //避免重复tap
			
			var level = overlay.down('selectfield[itemId=level]').getValue(),
				zsdID = overlay.down('selectfield[itemId=zsd]').getValue(),
				subjectID = me.getParentRecord().data.subjectID,
				courseNo = me.getParentRecord().data.courseNo
			
			Ext.Viewport.setMasked({xtype:'loadmask',message:'添加自适应题目'});
			
			var obj = {
				"level"    : level,
				"zsdID"    : zsdID,
				"subjectID": subjectID,
				"courseNo" : courseNo,
			}
			console.log(obj)
			
			Ext.data.JsonP.request({
			    url: Youngshine.app.getApplication().dataUrl + 'createOne2nTopic.php',
			    params: {
					data: JSON.stringify(obj)
			    },
				callbackKey: 'callback',
				//timeout: 9000,
			    success: function(result){
					console.log(result)
					Ext.getStore('Topic').load(); //reload .insert(0,result.data)
					//setTimeout(me.overlay.destroy(), 3000 )
					setTimeout(function(){ //延迟，才能滚动到最后4-1
						//me.overlay.destroy();
						overlay.destroy();
					},100);
					Ext.Viewport.setMasked(false)
			    }
			});
		}
	},
	
	// 返回
	onBack: function(){
		this.fireEvent('back',this)
	},
	
	onPDF: function(){
		var me = this;
		//this.fireEvent('pdf',this.getRecord(),this)
		
		var overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			width: 450,height: 450,
			scrollable: true,
			hidden: true,
			layout: 'fit',
			
			//parentRecord: record, //传递父窗口参数：当前学生记录
			
	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	//title: '选择知识点',
				ui: 'light',
				items: [{
					xtype: 'selectfield',
					width: 285,
					label: 'PDF教案：',
					labelWidth: 85,
					itemId: 'grade',
					displayField: 'text',
					valueField: 'value',
					value: me.getParentRecord().data.gradeID, //defalut
	                options: [
	                    {text: '九年级',  value: 9},
	                    {text: '八年级', value: 8},
	                    {text: '七年级',  value: 7},
						{text: '六年级',  value: 6},
	                    {text: '五年级',  value: 5},
	                    {text: '四年级', value: 4},
	                    {text: '三年级',  value: 3},
	                    {text: '二年级',  value: 2},
	                    {text: '一年级', value: 1},
	                ],
					//autoSelect: false, 	
					defaultPhonePickerConfig: {
						doneButton: '确定',
						cancelButton: '取消'
					},
					listeners: {
						change: function(){
							var panel = this.up('panel[itemId=modalZsd]')
							console.log('grade change')
							//panel.down('selectfield[itemId=zsd]').setDisabled(false)
							//panel.down('selectfield[itemId=zsd]').reset();
							//panel.down('button[action=ok]').setDisabled(true);
							//加载对应的知识点
							var obj = {
								subjectID : me.getParentRecord().data.subjectID,
								gradeID : this.getValue()
							} 						
							loadZsd(obj)
						},					
					},
				}]
			},{
				xtype: 'list',
				//disableSelection: true,
				onItemDisclosure: true,
			    itemTpl: '{zsdName}',
			    //data: [],
				store: "Zsd",
			}],	
			
			listeners: [{
				delegate: 'list',
				event: 'disclose',
				fn: function( list, modalRecord ){ 
					console.log('zsd list disclosure')
					// 显示对应科目的测评题目
					//var modal = list.up('panel')
					console.log(modalRecord)
					
					this.destroy() 
					
					me.fireEvent('pdf',modalRecord,this)
				}	
			}],
			
			// onZsd
		})
		overlay.show()
		
		
		var obj = {
			"subjectID": me.getParentRecord().data.subjectID,
			"gradeID"  : me.getParentRecord().data.gradeID
		}
		loadZsd(obj)
		
		function loadZsd(obj){
			console.log(obj)
			var storeZsd = Ext.getStore('Zsd'); 
			storeZsd.removeAll(true)
			storeZsd.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
				'readZsdList.php?data='+JSON.stringify(obj) );
			storeZsd.load({ //异步async
				callback: function(records, operation, success){
					if (success){
						console.log(records[0])
					};
				}   		
			});
		}
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
