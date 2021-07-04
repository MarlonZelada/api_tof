import app from './app';
import db from './database';

export default require('dotenv').config();

app.set('port', process.env.PORT || 3000);



app.listen(app.get('port'), () => {
    console.log('SERVER UP ON PORT', app.get('port'));
    
})
