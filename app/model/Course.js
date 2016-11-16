// 某个老师 a particular 已上课的一对多课时
Ext.define('Youngshine.model.Course', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'courseNo'}, // 课时编号，group by
			{name: 'timely'}, 
			{name: 'hour'}, // 一对多课时数
			{name: 'beginTime'}, 
			{name: 'endTime'}, 
			{name: 'kcTitle'}, //本课时对应的课程
			{name: 'kclistID'}, 
			{name: 'studentID'}, 
			{name: 'studentName'}, 
			//{name: 'wxID'}, //学生家长微信，公众号发模版消息
			{name: 'teacherID'}, 
			{name: 'teacherName'}, 
			
			{name: 'created'}, // sort by
			
			{ name: 'fullDate', convert: function(value, record){
					return record.get('beginTime').substr(2,8)
				} 
			},
			{ name: 'fullEndtime', convert: function(value, record){
					//return record.get('endTime')>'1911-01-01' ? record.get('hour')+'课时':'未下课'
					return record.get('hour')>0 ? record.get('hour')+'课时':'未下课'
				} 
			},
        ]
    }
});