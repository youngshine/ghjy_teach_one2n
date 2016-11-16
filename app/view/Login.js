Ext.define('Youngshine.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
	
    config: {	
		layout: {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
		},
		
    	//layout: 'fit',
    	items: [{
    		xtype: 'fieldset',
			title: '<div style="color:#888;">根号教育 • 教师PAD</div>',
			style: {
				maxWidth: '480px',
				margin: '50px auto 0',
			},
    		items: [{
    			xtype: 'textfield',
				itemId: 'username',
    			label: '账号',
				labelWidth: 85,
				placeHolder: '教师账号',
				clearIcon: false
    		},{
    			xtype : 'passwordfield',
				//itemId : 'psw',
				label : '密码',
				labelWidth: 85,
				clearIcon: false
			},{
				xtype: 'textfield',
				itemId: 'school',
    			label: '校区',
				labelWidth: 85,
				placeHolder: '输入联盟学校',
				clearIcon: false
    		}]
    	},{
			//html: '<br /><div class="forgetpassword" style="float:right;color:#fff;">忘记密码？</div>'
			xtype: 'button', 
			//style: 'margin:-10px 10px',
			text : '登录',
			ui : 'plain',
			action: 'login',
			disabled: true,
			style: {
				color: '#fff',
				background: '#66cc00',
				//border: '1px solid #9d9d9d'
				margin: '15px auto',
				maxWidth: '474px'
			}
		}],
    	
    	listeners: [{
    		delegate: 'button[action=login]',
    		event: 'tap',
    		fn: 'onLogin'
		},{
    		delegate: 'textfield',
    		event: 'keyup',
    		fn: 'onSetBtn'	
		},{
    		delegate: 'passwordfield',
    		event: 'change',
    		fn: 'onSetBtn'		
		}]
    },
    
	// 控制器Main
    onLogin: function(){
    	// 带入参数：当前表单的用户名和密码
    	var obj = {
    		"username": this.down('textfield[itemId=username]').getValue().trim(),
			"psw"     : this.down('passwordfield').getValue().trim(),
			"school"  : this.down('textfield[itemId=school]').getValue().trim()
    	}
    	this.fireEvent('loginOk', obj,this);		
    },	

	onSetBtn: function(){
		var username = this.down('textfield[itemId=username]').getValue().trim(),
			psw = this.down('passwordfield').getValue().trim(),
			school = this.down('textfield[itemId=school]').getValue().trim();
	
		var btnLogin = this.down('button[action=login]')	
		if(username != '' && psw != '' && school != ''){
			btnLogin.setDisabled(false);
		}else{
			btnLogin.setDisabled(true);
		}				
	},
	
	// 初始化
    initialize: function() {
        this.callParent();
		this.on({
            scope: this,
            painted: 'onPainted',
        });
    },
    onPainted: function() {
		console.log(localStorage.school)
		this.down('textfield[itemId=username]').setValue(localStorage.teacherName)
		this.down('textfield[itemId=school]').setValue(localStorage.schoolName)
		//Ext.getCmp('mySchool').setValue(localStorage.school)
    },
});