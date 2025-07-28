const sqlite3=require('sqlite3').verbose();
const dbf='url-shortener.db';

const db=new sqlite3.Database(dbf,(er)=>{
    if(er){
        console.error('Error opening database:',er.message);
    } else {
        console.log(`Successfully connected to ${dbf} database`);
        createTables();
    }
});

function createTables(){
    const createUrlsTable=`
        CREATE TABLE IF NOT EXISTS urls(
            shortc TEXT PRIMARY KEY,
            org_url TEXT NOT NULL,
            createt TEXT NOT NULL,
            expiret TEXT NOT NULL
        );
    `;
    const createAnalyticsTable=`
        CREATE TABLE IF NOT EXISTS analytics(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url_shortc TEXT NOT NULL,
            clickt TEXT NOT NULL,
            author TEXT,
            loc TEXT,
            FOREIGN KEY (url_shortc) REFERENCES urls (shortc)
        );
    `;
    db.serialize(() =>{
        db.run(createUrlsTable,(err) => {
            if(err){
                console.error('Error occured in creating "urls" table:',err.message);
            }else{
                console.log('"urls" table created');
            }
        });
        db.run(createAnalyticsTable,(err) => {
            if(err){
                console.error('Error occured in creating "analytics" table:',err.message);
            }else{
                console.log('"analytics" table created');
            }
        });
    });
    db.close((err) => {
        if(err){
            console.error('Error closing in database:',err.message);
        }else{
            console.log('Database connection closed and done with initialization');
        }
    });
}