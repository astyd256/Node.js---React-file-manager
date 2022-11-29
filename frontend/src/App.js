import React, {useEffect, useState} from 'react';
import FileDownload from "js-file-download";
import './App.css';

function App() {
  const[parent, setParent] = useState('');
  const [data, setData] = useState({
    path: "",
    files: []
  }); 


  useEffect(() => {
    fetch("http://localhost:8000/")
    .then(res => res.json())
    .then(
      (result) => {
        setParent('');
        setData(result);
      },
      (error) => {}
    )
  }, []);
  
  const clickDownloader = event => {
    event.preventDefault();
    const path = event.target.attributes.href.value;
    const filename = path.split('/').pop(); 
    fetch("http://localhost:8000" + path)
    .then(res => res.blob())
    .then(res => FileDownload(res, filename))
    
  }

  const clickHandler = event => {
    event.preventDefault();
    fetch("http://localhost:8000" + event.target.attributes.href.value)
      .then(res => res.json())
      .then(
        (result) => {
          let pathArr = result.path.split('/');
          // console.log(pathArr);
          pathArr.pop();
          // pathArr.pop();
          setParent(pathArr.join('/')) //setting state to previous folder
          setData(result);
        },
        (error) => {}
      );
  }

  return (
    <div className="file-manager">
      <div> 
        <a href= {parent} className = "back-button" onClick={clickHandler}> 
          <span class="material-icons">arrow_back</span> 
          BACK
        </a> 
      </div>
      <div className="current-level">
        current: {data.path === '' ? '/' : data.path}
      </div> 
      <ul className="folder-list">
        {data.files.map(file =>{
          
          if(file.dir) {
            return <li key={file.name} className = "folder">
                <a href={file.path} onClick ={clickHandler}>
                  <span className="material-icons">&#xe2c7;</span>
                  {file.name}
                </a>
              </li>
          }
          else {
            return <li key={file.name} className= "file">
              <a href={file.path} onClick={clickDownloader}>
                <span className="material-icons">&#xe873;</span>
                {file.name}
              </a>
            </li>
          }

        })}
      </ul>  
    </div>
  );
}

export default App;
