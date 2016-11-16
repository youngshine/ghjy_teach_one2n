// 教师的一对对课程表
Ext.define('Youngshine.store.Kcb', {
    extend: 'Ext.data.Store',
	
    config: {
        fields: [
			{name: 'timely'}, 
        ],
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },

    }
});
