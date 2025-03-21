"use client";

import Image from "next/image";
import React, { use } from "react";
import ImageUploading from "react-images-uploading";
import "./styles.css";
import { useState } from "react";
import { Button,IconButton, TextField } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import ReactLoading from 'react-loading';



export default function Home() {

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setRes("");
    const apiKe = "AIzaSyA9MeUuQPBMwUXtol3eg-b3dcPaEk6de6w"
    // const promptInput = prompt
    const apiKey = apiKeyValue.length === 0 ? apiKe : apiKeyValue;
    setIsLoading(true);
  
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
      // console.log(response);
      setIsLoading(false);
      setRes("data:image/jpeg;base64,"+response.data.candidates[0].content.parts[0].inlineData.data);
    })
    .catch(function (error) {
      setIsLoading(false);
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
    <div className="container">
      <div className = "app_bar">
        <div className= "heading_name"> <h1>Gemini Image Editor</h1>  </div>
        <div> 
        <p>Deployed On <a href="https://vercel.com/home" target="_blank">Vercel</a> &#128293; |
          Visit my <a href="https://github.com/Uraj14/gemini-image-edit" target="_blank">Github</a> Repo &#128293; | <a href="https://aistudio.google.com/apikey" target="_blank">Get an API Key</a> </p>
        </div>
      </div>

 
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
          <div className="app_body">
            <div className="cards_parent">
              <div className="cards">
                <div className="image_container">
                  {imageList.length === 0 ? "Upload Image" : 
                  imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img className="img_file" src={images[0].data_url} alt=""/>
                      {/* <div className="image-item__btn-wrapper"> */}
                        {/* <IconButton color="primary" size="large"  onClick={() => handlePartialDelete(onImageUpdate)}><RefreshIcon/></IconButton> */}
                        
                      {/* </div> */}
                    </div>
                  ))}
                  
                </div>

                <div className="api_container">
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


                <div className="api_container">
                  <TextField className="gemini_items" id="api" label="Gemini API Key (optional)" variant="outlined" onChange={(e)=>setApiKeyValue(e.target.value)}/>
                  <TextField className="gemini_items" id="prompt" label="Prompt" variant="outlined" multiline rows={2}  onChange={(e)=>setPrompt(e.target.value)}/>
                  <Button className="gemini_items" color="primary" variant="contained" onClick={(e)=>handleSubmit(e)}> Generate </Button>
                </div>
              </div>
              <div className="cards">
                <div className="image_container">
                  {res.length === 0 && isLoading === false ? "Generated Image" 
                    : res.length === 0 && isLoading === true ? "Generating Result..." :
                    <div className="image-item">
                      <img className="img_file" src={res} />
                    </div>
                  }
                </div>
                <div className="download_container">
                  {res.length === 0 && isLoading === false ? null
                    : res.length === 0 && isLoading === true ? null :
                      <a href={res} download={images[0].file.name}>
                        <Button color="primary" variant="outlined" startIcon={<DownloadIcon />}> Download</Button>
                      </a>
                  }
                </div>
                
              </div>
            </div>
            <div> </div>
          </div>
        )}
      </ImageUploading>
    </div>

  );
}
  