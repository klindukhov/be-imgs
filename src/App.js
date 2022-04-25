import { Alert, Box, Dialog, IconButton, Snackbar } from '@mui/material';
import './App.css';
import { Delete } from '@mui/icons-material'
import { useEffect, useState } from 'react';
import exifr from 'exifr'
import Dropzone from 'react-dropzone';

export default function App() {
  const [sOpen, setSOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);
  const [dialogPic, setDialogPic] = useState();

  const [dragOver, setDragOver] = useState(false);

  const [pics, setPics] = useState([]);

  useEffect(() => {
    console.log(pics)
  }, [pics])

  const handleAddPics = (fs) => {
    if (fs && fs[0] && fs[0].size < 1048576) {
      let temp = pics.slice();
      if (fs.length > 1) {
        Object.values(fs).forEach(f => {
          exifr.gps(f).then(data => {
            temp.push({ 'pic': URL.createObjectURL(f), 'file': f, 'gps': data });
            setPics(temp);
          }).catch(e=>{
            temp.push({ 'pic': URL.createObjectURL(f), 'file': f });
            setPics(temp);
          })
        })
      } else {
        exifr.gps(fs[0]).then(data => {
          temp.push({ 'pic': URL.createObjectURL(fs[0]), 'file': fs[0], 'gps': data })
          setPics(temp);
        }).catch(e => {
          temp.push({ 'pic': URL.createObjectURL(fs[0]), 'file': fs[0] });
          setPics(temp);
        });
      }
    } else {
      setSOpen(true);
    }
  }

  const handleDeleteImage = (e) => {
    let temp = pics.slice();
    temp.splice(temp.indexOf(e), 1);
    setPics(temp);
  }

  return (

    <div className="main">
      <Dialog open={dOpen} onClose={() => setDOpen(false)}>
        <img alt='alt' src={dialogPic} />

      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={sOpen}
        onClose={() => setSOpen(false)}
        autoHideDuration={6000}
      >
        <Alert severity="warning">This file is too big or of the wrong format!</Alert>
      </Snackbar>

      <div className="upload-container">
        <Dropzone accept='.jpeg, .jpg' onDragOver={() => setDragOver(true)} onDragLeave={() => setDragOver(false)} onDrop={f => handleAddPics(f)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Box sx={{ border: '1px dashed blue', height: '50vh', borderRadius: '1vh', display: 'grid', cursor: 'pointer' }}>
                  <p className='box-title'>
                    Drop image here {!dragOver && <>or click to browse</>}
                  </p>
                </Box>
              </div>
            </section>
          )}
        </Dropzone>
      </div>




      {pics.map(p =>
        <div className='img-container' key={p.file.name}>
          <span className="row-id">{pics.indexOf(p) + 1}</span>
          <div className='img-preview'>
            <img alt={p.file.name} src={p.pic} onClick={() => { setDialogPic(p.pic); setDOpen(true) }} style={{ 'height': '20vh', borderRadius: '1vh', cursor: "pointer" }} />
          </div>
          <div className='img-info'>
            <span className='img-title'>
              {p.file.name}
            </span><br />
            <span>
              {p.file.type} <br />
              {p.file.size / 1048576} MB<br />
              {p.gps?.latitude + ',   ' + p.gps?.longitude}
            </span>

          </div>
          <IconButton onClick={() => handleDeleteImage(p)} sx={{ width: '2vw', justifySelf: 'end' }}><Delete /></IconButton>
        </div>
      )}

    </div>
  );
}

