// 某个老师 a particular教学知识点列表
Ext.define('Youngshine.model.Zsd', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'zsdID'}, 
			{name: 'zsdName'}, 
			{name: 'gradeName'}, 
			{name: 'gradeID'}, 
			{name: 'semester'}, 
			{name: 'subjectName'}, 
			{name: 'subjectID'}, 
			{name: 'PDF'}, 
			{name: 'description'}, 
			{name: 'teacherID'}, 
        ]
    }
});