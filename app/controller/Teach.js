// 教学控制器，zsd,student,topic-teach
Ext.define('Youngshine.controller.Teach', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	course: 'course',
			//zsd: 'zsd',
			//student: 'student',
			topic: 'topic',
			topicteachshow: 'topic-teach-show',
			topicteachphotos: 'topic-teach-photos',
			topicteachtest: 'topic-teach-test',
			pdf: 'pdf-file'
        },
        control: {
			course: {
				//select: 'zsdSelect', //itemtap
				itemtap: 'courseItemtap', 
				//itemswipe: 'courseItemswipe'
			}, /*
			student: {
				itemtap: 'studentItemtap', 
				zsd: 'studentZsd', //返回显示知识点列表
				pdf: 'studentPDF'
			}, */
			topic: {
				fetchTopic: 'topicteachFetch',//抓取自适应考题 
				back: 'topicBack', 
				photos: 'topicteachPhotos', //该学生该知识点教学过程
				test: 'topicteachTest', //昨对10题，考试给家长看
				pass: 'topicteachPass', //通过学习，不能再操作
				pdf: 'topicteachPDF',
				itemtap: 'topicteachItemtap',
			},
			topicteachshow: {
				back: 'topicteachshowBack',
				del: 'topicteachshowDelete', 
				done: 'topicteachshowDone' // 评分
			},
			'pdf-file': {
				back: 'pdfBack'
			},
			topicteachphotos: {
				back: 'topicteachphotosBack',
				del: 'topicteachphotosDelete', //删除一个图片
			},
			topicteachtest: {
				back: 'topicteachtestBack',
				fetchTopicTest: 'topicteachtestFetch', //随机出一个考题
				pass: 'topicteachtestPass', //通过学习，不能再操作
			},
        }
    },

	// 一对多手机点名课时
	showCourse: function(teacherID){
		var me = this;
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		// 预先加载的数据
		var obj = {
			"teacherID": teacherID
		}
		var store = Ext.getStore('Course'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readOne2nCourseList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					//me.showSearch();
					Ext.Viewport.setMasked(false);
					
					me.course = Ext.create('Youngshine.view.teach.Course')	
					//me.course.down('toolbar').setTitle(localStorage.teacherName+'老师的上课列表')	
					Ext.Viewport.add(me.course);
					Ext.Viewport.setActiveItem(me.course);
					/*
					// 全部下课，才能开始上课
					Ext.Array.each(records, function(record) {
					    console.log(record.data)
						if(record.data.endTime < '1901-01-01'){
							me.course.down('button[action=addnew]').setDisabled(true)
							return false
						}
					}); */
				}else{
					Ext.toast('服务请求失败',3000); // toast 1000
				};
			}   		
		});
	},	
	
	// 登录后跳转这里，一对多教师的课程表
	showKcb: function(teacherID){
		var me = this;
		console.log(teacherID)
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		// 预先加载的数据
		var obj = {
			"teacherID": teacherID
		}
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'readTeacher.php',
			callbackKey: 'callback',
			//timeout: 14000,
			//params: obj, // ajax, not jsonp
            params:{
                data: JSON.stringify(obj)
            },
			success: function(result){ 
				console.log(result.data)
				Ext.Viewport.setMasked(false); 
				if (result.success){ 
					// 只有一条记录[0]，拆分上课时间列表
					var timely_list = result.data.timely_list_one2n.split(',')
					timely_list = Ext.Array.sort(timely_list)
					console.log(timely_list)
					//Ext.getStore('Kcb').setData(timely_list)
					var store = Ext.getStore('Kcb')
					Ext.Array.each(timely_list, function(timely, index, countriesItSelf) {
					    //arrTimely.push(timely  )  
						store.add({"timely":timely}) 
					});
					console.log(store.data)
					/*
					var arrTimely = []
					Ext.Array.each(timely_list, function(timely, index, countriesItSelf) {
					    arrTimely.push(timely  )   
					});
					arrTimely = Ext.Array.sort()
					console.log(arrTimely)
					*/
					me.kcb = Ext.create('Youngshine.view.teach.Kcb')	
					Ext.Viewport.add(me.kcb);
					Ext.Viewport.setActiveItem(me.kcb);
				}
			},
		});
	},	

	// 如果点击‘下课’
	courseItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; console.log(record)

		me.topic = Ext.create('Youngshine.view.teach.Topic')
		me.topic.setParentRecord(record);
		//me.topic.down('toolbar').setTitle(record.data.studentName)

		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		// 预先加载的数据
		var obj = {
			"courseNo": record.data.courseNo, //当前课时的练习题集
		}
		var store = Ext.getStore('Topic'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readTopicListByCourse.php?data=' + JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					Ext.Viewport.setMasked(false);
					Ext.Viewport.add(me.topic); //build
					Ext.Viewport.setActiveItem(me.topic);
					
					var btnTest = me.topic.down('button[action=test]'),
						btnPhoto = me.topic.down('button[action=photo]')
					console.log(btnPhoto)
					btnTest.setHidden(records.length<10 ? true : false)
					//btnPhoto.setHidden(records.length<1 ? true : false)
				}else{
					Ext.toast('出错',3000);
				};
			}   		
		});		
	},
	
	topicBack: function(oldView){		
		var me = this;
		Ext.Viewport.setActiveItem(me.course)
		Ext.Viewport.remove(me.topic,true)
	},
	
	topicteachPDF: function(rec){		
		console.log(rec);
		var me = this;
		
		var file = '';
		if(rec.data.subjectID==1){
			file = '../PDF/sx/'
		}else if(rec.data.subjectID==2){
			file = '../PDF/wl/'
		}else if(rec.data.subjectID==2){
			file = '../PDF/hx/'
		}
		file += rec.data.PDF
		console.log(file)
		
		me.pdf = Ext.create('Youngshine.view.teach.Pdf-file')
		me.pdf.down('pdfpanel').setSrc(file); // pdf file in zsd table
		Ext.Viewport.add(me.pdf)
		Ext.Viewport.setActiveItem(me.pdf);
	},
	pdfBack: function(oldView){		
		var me = this;
		Ext.Viewport.setActiveItem(me.topicteach)
		Ext.Viewport.remove(me.pdf,true)
	},
	
	// 返回选择学生，store不变, rec是上级course
	topicteachPhotos: function(rec,oldView){		
		var me = this;
		me.studyphotos = Ext.create('Youngshine.view.teach.Topic-teach-photos')
		//me.studyphotos.setOldView(oldView);	// oldView当前父view
		me.studyphotos.setRecord(rec);	// record
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		var obj = {
			"studentstudyID": rec.data.studentstudyID, //zsd & student
		}
		var store = Ext.getStore('Study-photos'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudyPhotosList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				console.log(records);
				Ext.Viewport.setMasked(false);
				if (success){
    				Ext.Viewport.add(me.studyphotos); //build
					Ext.Viewport.setActiveItem(me.studyphotos);
				}else{
					Ext.toast('服务请求失败',3000);
				};
			}   		
		});	
	},
	// 做题后，考试给家长看, 随机出题，不保存？？？？
	topicteachTest: function(rec,oldView){		
		var me = this; console.log(rec)
		me.topictest = Ext.create('Youngshine.view.teach.Topic-teach-test')
		me.topictest.setRecord(rec);	// record
		me.topictest.down('label[itemId=zsd]').setHtml(rec.data.zsdName)
		Ext.Viewport.add(me.topictest)
		Ext.Viewport.setActiveItem(me.topictest)
		
		//Ext.getStore('Topic-test').removeAll() ; //每次考试题临时表清空
		
		/*
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		var obj = {
			"studentstudyID": rec.data.studentstudyID, //zsd & student
		}
		var store = Ext.getStore('Topic-test'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readTopictestList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					Ext.Viewport.setMasked(false);
					Ext.Viewport.setActiveItem(me.studyphotos);
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});	 */
	},
	// 通过学习studentstudy报读表，不能再任何题目操作
	topicteachtestPass: function(pass,record,view){
		var me = this;
		console.log(record.data)

		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在更新'});
		var obj = {
			"pass": pass,
			"studentstudyID": record.data.studentstudyID
		}
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'updateStudentstudy.php',
			callbackKey: 'callback',
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){			
					/*
					Ext.Viewport.setMasked({xtype:'loadmask',message:'祝贺你考试通过！课程结束',indicator: false});
					setTimeout(function(){ //延迟，才能滚动到最后4-1
						window.location.reload();
					},5000); */
					Ext.toast('祝贺你考试通过，课程结束。',9000)
					window.location.reload();
				}else{
					Ext.toast(result.message,3000); // 错误模式窗口
				}
			}
		});
	},	
	// 根据level难度 抓取该生的自适应题目，并把记录添加到store:topic-teach
	topicteachFetch: function(obj){
		var me = this;
		console.log(obj); 
		Ext.Viewport.setMasked({xtype:'loadmask',message:'添加自适应题目'});

		// 自适应出题：抓取第一组题目（3,4,5）根据学生level，以后的根据做提评分level
		// 取得记录，直接保存道 topic-teach表，从新load表
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'createTopicteach.php', 
			callbackKey: 'callback',
			timeout: 9000,
			params:{
				data: JSON.stringify(obj)
				/* data: '{"level":"' + level + 
					'","zsdID":"' + zsdID + 
					'","studentstudyID":"' + studentstudyID + '"}' */
			},
			success: function(result){ // 服务器连接成功 
				Ext.Viewport.setMasked(false); 
				if (result.success){ // 返回值有success成功
					//console.log(result.data)
					// 直接添加到后台数据表ghjy_topic-teach，最新在最上面
					Ext.getStore('Topic-teach').load()
					//store.add(result.data).. store.insert()
					//console.log(store.data)		
				}else{
					Ext.toast(result.message,3000);
				}
			},
		});

	},	
	topicteachItemtap: function(list,index,item,record){
    	var me = this;
		//this.topicteach.hide(); //remove(); 返回用
		me.topicteachshow = Ext.create('Youngshine.view.teach.Topic-teach-show');
		me.topicteachshow.setRecord(record); // 传递参数而已，题目id
		Ext.Viewport.add(me.topicteachshow)
		Ext.Viewport.setActiveItem(me.topicteachshow)
	},

	topicteachshowBack: function(oldView){		
		var me = this;
		Ext.Viewport.setActiveItem(me.topicteach)
		Ext.Viewport.remove(me.topicteachshow,true)
	},	
	topicteachshowDelete: function(record,view){
		var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在删除'});
		Ext.data.JsonP.request({
			// 删除服务端记录: 最好做个标记，别真正删除？或者过期的和定期的不能删除？
			// 否则，删除过的题目，添加时候可能再出现
			url: me.getApplication().dataUrl + 'deleteTopicteach.php',
			callbackKey: 'callback',
			params:{
				data: '{"topicteachID":' + record.data.topicteachID + '}'
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					Ext.getStore('Topic-teach').remove(record); //.removeAt(i); 

					Ext.Viewport.setActiveItem(me.topicteach);
					Ext.Viewport.remove(me.topicteachshow,true); //关闭自己					
				}else{
					Ext.toast(result.message,3000);
				}
			},
			failure: function(){
				Ext.Viewport.setMasked(false);
				Ext.toast('服务请求失败',3000);
			}
		});	
	},
	// save & refresh 单个题目show.js
	topicteachshowDone: function(done,fullDone,record,view){
		var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在评分'});
		var obj = {
			"done": done,
			"topicteachID": record.data.topicteachID
		}
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'updateTopicteach.php',
			callbackKey: 'callback',
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){			
					//本地更新数据：打分结果 model.set, setRecord/updateRecord
					//var model = record.data ????????
					record.set('done',done)
					record.set('fullDone',fullDone)
				}else{
					Ext.toast(result.message,3000); // 错误模式窗口
				}
			}
		});
	},	

	topicteachphotosBack: function(){
		var me = this
		Ext.Viewport.setActiveItem(me.topicteach)
		Ext.Viewport.remove(me.topicteachphotos,true)
	},	
	// 删除教学图片
	topicteachphotosDelete: function(rec){
		var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在删除'});
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'deleteStudyPhotos.php',
			callbackKey: 'callback',
			params:{
				data: '{"studyphotoID":' + rec.data.studyphotoID + '}'
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){
					Ext.getStore('Study-photos').remove(rec); 				
				}else{
					Ext.toast(result.message,3000);
				}
			},
			failure: function(){
				Ext.Viewport.setMasked(false);
				Ext.toast('服务请求失败');
			}
		});	
	},
	
	topicteachtestBack: function(){
		var me = this
		Ext.Viewport.setActiveItem(me.topicteach)
		Ext.Viewport.remove(me.topicteachtest,true)
	},
	// 随机出一个考题，临时表
	topicteachtestFetch: function(obj,win){
		var me = this;
		console.log(obj); 
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在随机出题'});

    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'createTopicTest.php', 
			callbackKey: 'callback',
			//timeout: 9000,
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){ // 服务器连接成功 
				Ext.Viewport.setMasked(false); 
				if (result.success){ // 返回值有success成功
					console.log(result.data[0])
					//win.updateRecord(result.data[0])
					win.down('panel[itemId=topicInfo]').setData(result.data[0]);
					win.down('button[action=pass]').setHidden(false)
					//return
					/*
					var store = Ext.getStore('Topic-test')
					store.removeAll()
					store.insert(0,result.data); //临时保存	
					
					var btnPass = me.topictest.down('button[action=pass]')
					console.log(btnPass)
					btnPass.setHidden(false) */
				}else{
					Ext.toast(result.message,3000);
				}
			},
		});
	},	
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('teach controller init');
	}
});
