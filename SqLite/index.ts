import express from 'express'
import Database from 'better-sqlite3';
const db = new Database('foobar.db',  { verbose: console.log});

const app: express.Application = express();
const port: number = 3000;

db.exec('CREATE TABLE IF NOT EXISTS') 
 
app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
})

app.get('/', (req, res) => {
    
    const stmt = db.prepare('INSERT INTO people VALUES (?, ?, ?)');
    stmt.run('John Doe', 25, 'M');
    console.log(db.prepare('SELECT * FROM sqlite_master').all());
    const somedata = db
    
    res.send(somedata);
});