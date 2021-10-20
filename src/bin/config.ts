
export const config = {
    'secretKey': '12345-67890-09876-54321', 
      'mongoUrl':{
       'dev': 'mongodb://localhost:27017/dev-db', 
       'local': 'mongodb://localhost:27017/conFusion', 
       'Prod': 'mongodb://apps:'+encodeURIComponent('Kh@198061')+'@192.168.1.6:27017/conFusion',
       'admin': 'mongodb://mongo_root:'+encodeURIComponent('Kh@198061')+'@192.168.1.6:27017/conFusion?authSource=admin'
      },
    'facebook': {
        'clientId': 'Your Client App ID',
        'clientSecret': 'Your Client App Secret'
    }
}
