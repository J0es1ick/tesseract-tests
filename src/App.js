import Tesseract from "tesseract.js";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("rus");
  const [recognizedText, setRecognizedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageInputRef = useRef(null);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedImage(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClickImage = () => {
    imageInputRef.current.click();
  };

  useEffect(() => {
    const recognizeImage = async () => {
      if (!selectedImage) return;

      setIsLoading(true);
      setProgress(0);
      setRecognizedText("");

      try {
        const { data } = await Tesseract.recognize(
          URL.createObjectURL(selectedImage),
          selectedLanguage,
          {
            logger: (info) => {
              if (info.status === "recognizing text") {
                setProgress(info.progress);
              }
              console.log(info);
            },
          }
        );
        setRecognizedText(data.text);
      } catch (error) {
        console.error("OCR Error:", error);
        setRecognizedText("Error during OCR. Please check the console.");
      } finally {
        setIsLoading(false);
      }
    };

    recognizeImage();
  }, [selectedImage, selectedLanguage]);

  return (
    <div className="container">
      <h1>Tesseract Tests</h1>
      <div className="language-selector">
        <label htmlFor="language">Select Language:</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="eng">English</option>
          <option value="rus">Russian</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
        </select>
      </div>
      <div
        className="image-upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClickImage}
      >
        {selectedImage ? (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded"
            className="preview-image"
          />
        ) : (
          <p>Drag and drop an image here, or click to select a file.</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          ref={imageInputRef}
        />
      </div>
      {isLoading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress * 100}%` }}>
            {Math.floor(progress * 100)}%
          </div>
        </div>
      )}
      <div className="recognized-text">
        <h2>Recognized Text:</h2>
        <pre>{recognizedText}</pre>
      </div>
    </div>
  );
}

export default App;
