"use client";

import Image from "next/image";
import React, { use } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ImageUploading from "react-images-uploading";
import "./styles.css";
import { useState } from "react";
import { Button,IconButton, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";



export default function Home() {

  const [images, setImages] = useState([]);
  const [res, setRes ] = useState("");
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };


  const [apiKeyValue, setApiKeyValue] = useState("");
  const [prompt, setPrompt] = useState("");



  const handleSubmit = (e) => {
    e.preventDefault();
    const apiKe = "AIzaSyA9MeUuQPBMwUXtol3eg-b3dcPaEk6de6w"
    // const promptInput = prompt
    const apiKey = apiKeyValue.length === 0 ? apiKe : apiKeyValue;
  
    axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent',
      {
        'contents': [
          {
            'parts': [
              {
                'text': prompt
              },
              {
                'inline_data': {
                  'mime_type': 'image/jpeg',
                  'data': images[0].data_url.split("data:image/jpeg;base64,")[1]
                }
              }
            ]
          }
        ],
          'generationConfig': {
            'responseModalities': ['Text','Image']
          }
        },
      {
        params: {
          'key': apiKey
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(function (response) {
      console.log(response);
      setRes("data:image/jpeg;base64,"+response.data.candidates[0].content.parts[0].inlineData.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const handleDelete = (y) => {
    y();
    setRes("")

  }

  const handlePartialDelete = (y) => {
    y(0);
    setRes("")

  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="red"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IMAGE EDIT WITH GEMENI
          </Typography>
        </Toolbar>
      </AppBar>


      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg","jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          <div>
            <div>
              <div className="cards">
                <div className="image_container">
                {/* <div class="tools">
                  <div class="circle">
                    <span class="red box"></span>
                  </div>
                  <div class="circle">
                    <span class="yellow box"></span>
                  </div>
                  <div class="circle">
                    <span class="green box"></span>
                  </div>
                </div> */}
                  {imageList.length === 0 ? "Upload Image" : 
                  imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image.data_url} alt="" width="300" />
                      <div className="image-item__btn-wrapper">
                        {/* <IconButton color="primary" size="large"  onClick={() => handlePartialDelete(onImageUpdate)}><RefreshIcon/></IconButton> */}
                        
                      </div>
                    </div>
                  ))}
                  
                </div>

                <div className="image_container">
                  {/* <div class="tools">
                    <div class="circle">
                      <span class="red box"></span>
                    </div>
                    <div class="circle">
                      <span class="yellow box"></span>
                    </div>
                    <div class="circle">
                      <span class="green box"></span>
                    </div>
                  </div> */}
                  {res.length === 0 ? "Generated Image"
                    :
                    <div className="image-item">
                    <img src={res} width="300" />
                    </div>
                  }
                </div>
              {/* <img src={`data:image/jpeg;base64,${data}`} /> */}
              </div>

              <div className="upload__image-wrapper">
                { images.length === 0 ? 
                  <IconButton color="primary" size="large"  style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpload}
                    {...dragProps}>
                      <UploadIcon/>
                  </IconButton>
                  :
                  <IconButton color="primary" size="large" disabled style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpload}
                    {...dragProps}>
                      <UploadIcon/>
                  </IconButton>
                }
                
                {images.length === 0
                  ?
                  <IconButton color="primary" size="large" disabled  onClick={() => handlePartialDelete(onImageUpdate)}><RefreshIcon/></IconButton>
                  :
                  <IconButton color="primary" size="large"  onClick={() => handlePartialDelete(onImageUpdate)}><RefreshIcon/></IconButton>
                }
                
                &nbsp;
                <IconButton color="secondary" size="large" onClick={()=>{handleDelete(onImageRemoveAll)}}><DeleteIcon /></IconButton>
                {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
                
              </div>
            </div>
            <div className="api_gen">
              <TextField className="gemini_items" id="api" label="Gemini API Key (optional)" variant="filled" onChange={(e)=>setApiKeyValue(e.target.value)}/>
              <TextField className="gemini_items" id="prompt" label="Prompt" variant="filled" onChange={(e)=>setPrompt(e.target.value)}/>
              <Button className="gemini_items" color="primary" variant="contained" onClick={(e)=>handleSubmit(e)}> Generate </Button>
            </div>

            
          </div>
        )}
      </ImageUploading>
    </div>

  );
}
  