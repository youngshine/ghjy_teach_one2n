// 处理基本逻辑和登录
Ext.define('Youngshine.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
			login: 'login',
        },
        control: {
			login: {
				loginOk: 'loginOk',
				//loginForgetpassword: 'loginForgetpassword' //忘记密码
			}
        },
        before: {
        
        },
        routes: {
        	//'main': 'showMain',
        	//'login': 'showLogin',
        	//'register': 'showRegister'
        }
    },

    loginOk: function(obj,oldView){  	
    	var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在登录'});	
		
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'login.php',
			callbackKey: 'callback',
			//timeout: 14000,
			//params: obj,
			params: {
				data: JSON.stringify(obj)
			},
			success: function(result){ // 服务器连接成功
				Ext.Viewport.setMasked(false); 
				//var ret = JSON.parse(response.responseText)
				//var ret = Ext.JSON.decode(response.responseText,true)
				//console.log(result)
				if (result.success){ // 返回值有success成功
					console.log(result.data)
					localStorage.setItem('teacherID',result.data.teacherID);
					localStorage.setItem('teacherName',result.data.teacherName);
					localStorage.setItem('schoolName',result.data.schoolName); // not schoolID
					localStorage.setItem('schoolID',result.data.schoolID);
					 // 会员id保存在localstorage，app.js, logout退出到登录界面用？4.4

					Ext.Viewport.remove(oldView,true); // dom remove myself
					// 跳转页面：选择当堂课教授知识点列表	
					//me.getApplication().getController('Teach').showKcb(ret.data.teacherID);
					me.getApplication().getController('Teach').showCourse(result.data.teacherID);		
				}else{
					Ext.toast(result.message,3000);
				}
			},
			failure: function(){
				//myMsgbox.hide();
				Ext.Viewport.setMasked(false);
				Ext.toast('服务请求失败',3000);
			}
		});
	},
	// 用户注销退出，来自Main控制器
	// 清除全局变量，清除界面，清除localstorage 状态，清除定期发生的函数（位置刷新和未读消息抓取）
	// 清除views,removeAll(true,true),控制器、store不清除？
	// store.removeAll(true,true)别清除本地数据，换个帐号登录，本地数据如何办？id区分？
	logout: function(){
    	Ext.Msg.confirm('',"确认退出？",function(btn){	
			if(btn == 'yes'){
				//Ext.Viewport.setMasked({xtype:'loadmask',message:'正在注销'});
				Ext.toast('正在注销...',6000)
				window.location.reload();
			}
		});
	},
	
	// controller launch Called by the Controller's application immediately after the Application's own launch function has been called. This is usually a good place to run any logic that has to run after the app UI is initialized. 
	launch: function(){
		console.log('main controller launch logic');
		var me = this;
/*		
		//Ext.Viewport.setMasked({xtype:'loadmask',message:'读取加盟校区'});
		// 预先加载的数据
		var store = Ext.getStore('School'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 'readSchoolList.php');
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records[0].data);
					//me.showSearch();
					//Ext.Viewport.setMasked(false)
					Ext.fly('appLoadingIndicator').destroy();
					
					// 在这里调用login，才能取得localstorage
					//var view = Ext.create('Youngshine.view.Login');
					//Ext.Viewport.add(view);
					//Ext.Viewport.setActiveItem(view);
				}else{
					me.alertMsg('服务请求失败',3000)
				};
			}   		
		});
*/		
	}
    
});