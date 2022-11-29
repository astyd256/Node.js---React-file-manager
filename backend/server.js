const express = require('express');
const app = express();
const port = 8000;


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

const fs = require('fs');

app.get('/*/', (req, res) => {

    const base = './files';
    if (fs.existsSync(base + req.path))
    {
        if (fs.lstatSync(base + req.path).isFile())
        {
            res.download(base + req.path);
        }
        else if (fs.lstatSync(base + req.path).isDirectory())
        {
            let files = fs.readdirSync(base + req.path).map(file => {
                let isDir = fs.lstatSync(base + req.path + '/' + file).isDirectory();
                let size = 0;
                
                if (!isDir) {
                    size = fs.statSync(base + req.path + '/' + file);
                }
    
                return {
                    name: file,
                    dir: isDir,
                    size: size ?? 0,
                    path: req.path == '/'? '/' + file : req.path + '/' + file,
                };
            });
            
            res.json({
                result: true,
                files: files,
                path: req.path
            });
        }
        
    }
    else res.send('File does not exist');
});

app.listen(port, ()=> {
    console.log('listening on port ' + port);
}); 