// 当堂课教学的题目及其答案
Ext.define('Youngshine.model.Topic', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'topicID'}, 
			{name: 'courseNo'}, //学生报读知识点记录，包括student+zsd 
			{name: 'zsdID'}, 
			{name: 'gid'},  //新题库题目id
			//{name: 'studentID'}, //对应个体学生的
			//{name: 'zsdID'}, //对应的报读唯一知识点
			//{name: 'zsdName'}, 
			{name: 'subjectID'}, //学科
			{name: 'subjectName'},
			{name: 'done'}, //题目做完
			{name: 'done_pt'}, //得分，平均分2，为中等，高的推高分题
			{name: 'tested'}, //是否测试
			{name: 'passed'}, //通过
			
			//{name: 'pic_teach'}, //例题
			//{name: 'pic_teach_answer'}, //教学例题的答案（图片格式）
			{name: 'content'}, //例题
			{name: 'answer'}, //answer
			{name: 'level'}, //难度 1，2，3
			{name: 'created'}, //排序用
			
			{ name: 'fullDone', convert: function(value, record){
					var done = record.get('done');
					if(done==0)
						return '未做题'
					if(done==1)
						return '做错';
					if(done==2)
						return '讲解后做对';
					if(done==3)
						return '做对';
				} 
			}, 
			{ name: 'fullLevel', convert: function(value, record){
					var level = record.get('level');
					if(level==1)
						return '低';
					if(level==2)
						return '中';
					if(level==3)
						return '高';
				} 
			},
        ]
    }
});