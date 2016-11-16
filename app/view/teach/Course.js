//* Displays a list of course
Ext.define('Youngshine.view.teach.Course', {
    extend: 'Ext.dataview.List',
	xtype: 'course',

    id: 'courseList',

    config: {
        //ui: 'round',
		//layout: 'fit',
		store: 'Course',
		disableSelection: true,
        //itemHeight: 89,
        emptyText: '空白',
		striped: true,
        itemTpl: [
			'<div>{beginTime}<span style="float:right;">{fullEndtime}</span></div>'+
			'<div style="color:#888;">{timely}'+
			'<span style="float:right;">{kcTitle}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '教师上课记录',
			items: [{
				ui : 'decline',
				action: 'quit',
				text : '退出',
				handler: function(){
					Youngshine.app.getController('Main').logout()
				}
			},{
				xtype: 'spacer'
			},{
				//text : '＋新增上课',
				iconCls: 'settings',
				ui: 'plain',
				//action: 'addnew',
				handler: function(btn){
					btn.up('list').onSetup(btn)
				}	
			}]
    	}],
		
		listeners: [{
			element: 'element',
			delegate: 'span.addnew',
			event: 'tap',
			fn: 'onAddnew'
		},{
			element: 'element',
			delegate: 'span.hist',
			event: 'tap',
			fn: 'onHist'	
		}],
    },
	
	// 设置密码 ，small window-overlay
	onSetup: function(){
		var me = this; 
		this.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			showAnimation: {
				
			},
			hideAnimation: {
				
			},
			centered: true,
			width: 430,height: 260,
			scrollable: true,

	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '密码修改',
				items: [{
					text: '保存',
					ui: 'confirm',
					action: 'save',
					handler: function(btn){
						var psw1 = btn.up('panel').down('passwordfield[itemId=psw1]').getValue().trim(),
							psw2 = btn.up('panel').down('passwordfield[itemId=psw2]').getValue().trim()
						console.log(psw1)
						if(psw1.length<6){
							Ext.toast('密码长度至少6位',3000)
							return
						}
						if(psw1 != psw2){
							Ext.toast('确认密码错误',3000)
							return
						}
						// ajax
						Ext.Ajax.request({
						    url: Youngshine.app.getApplication().dataUrl + 'updatePsw.php',
						    params: {
						        psw1     : psw1,
								//psw2     : psw2,
								teacherID: localStorage.teacherID
						    },
						    success: function(response){
						        var text = response.responseText;
						        // process server response here
								Ext.toast('密码修改成功',3000)
								btn.up('panel').destroy()
						    }
						});
					}
				}]
			},{
				xtype: 'fieldset',
				width: 400,
				//margin: '10 10 0 10',
				items: [{
					xtype: 'textfield',
					readOnly: true,
					label: '学校',
					value: localStorage.schoolName
				},{
					xtype: 'textfield',
					readOnly: true,
					label: '教师',
					value: localStorage.teacherName
				},{
					xtype : 'passwordfield',
					itemId : 'psw1',
					//margin: '1 10 0 10',
					placeHolder: '长度至少6位',
					label : '新密码', //比对确认密码
					listeners: {
						focus: function(){
							//this.up('panel').down('button[action=save]').setText('保存')
						},					
					},
					scope: this
				},{
					xtype : 'passwordfield',
					itemId : 'psw2',
					//margin: '1 10 0 10',
					label : '确认密码',
					scope: this
				}]	
			}],	
		})
		this.overlay.show()
	},	
	
});
