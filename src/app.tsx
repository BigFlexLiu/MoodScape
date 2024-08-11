import { Button, Rows, Text, Title, MultilineInput, WordCountDecorator } from "@canva/app-ui-kit";
import { useState } from "react";
import styles from "styles/components.css";
import ImagePicker from "./imagepicker";

export const App = () => {
  const [keywords, setKeywords] = useState<String[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [imageSelection, setImageSelection] = useState([0])
  const [isAdding, setIsAdding] = useState(false);
  const [isImagePicking, setIsImagePicking] = useState(false)

  const onClick = async () => {
    const url = "http://localhost:3000/api/keywords";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setKeywords(json.aggregated_response.candidates[0].content.parts[0].text.split(","))
      setIsImagePicking(true)
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const removeKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const addKeyword = (event) => {
    if (event.key === 'Enter' && newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      setIsAdding(false);
    }
  };

  if (!isImagePicking) {
    return (<div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>
          We create Mood boards for you
        </Title>
        <MultilineInput
          autoGrow
          minRows={3}
          placeholder="Describe the mood board you envision"
        />
        <Button variant="primary" onClick={onClick} stretch>
          Generate images
        </Button>
      </Rows>
    </div>)
  }

  return (
    <div className={styles.scrollContainer}>
      <div style={customstyles.keywordContainer}>
        {keywords.map((keyword, index) => (
          <div key={index} style={customstyles.keyword}>
            {keyword}
            <span style={customstyles.deleteIcon} onClick={() => removeKeyword(index)}>✖</span>
          </div>
        ))}
        {isAdding ? (
          <input
            type="text"
            style={customstyles.input}
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={addKeyword}
            onBlur={() => {
              setIsAdding(false);
              setNewKeyword('');
            }}
            autoFocus
          />
        ) : (
          <div style={customstyles.addKeyword} onClick={() => setIsAdding(true)}>
            +
          </div>
        )}
      </div>
      <div style={{margin: "8px"}}></div>
      <ImagePicker imageSelection={imageSelection} setImageSelection={setImageSelection}></ImagePicker>
      <button style={customstyles.stickyButton}>Create Moodboard</button>
    </div>
  );
};


const customstyles = {
  container: {
    maxWidth: '400px', // Adjust width as needed
    margin: '0 auto',  // Center the container
  },
  keywordContainer: {
    maxHeight: '120px', // Set the maximum height
    overflowY: 'auto', // Enable vertical scrolling
    overflowX: 'hidden', // Prevent horizontal scrolling
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px', // Space between keywords
    backgroundColor: '#9f9f9f',
  },
  keyword: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  deleteIcon: {
    marginLeft: '8px',
    cursor: 'pointer',
    color: '#ff0000',
  }, 
  addKeyword: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    height: '30px',  // Ensure this matches the height of other items
    boxSizing: 'border-box', // Ensure padding and borders are included in the height
  },
  input: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '14px',
    width: '100px',
    height: '30px',  // Ensure this matches the height of other items
    boxSizing: 'border-box', // Ensure padding and borders are included in the height
  },  
  stickyButton: {
    position: 'fixed',
    bottom: '20px', // Distance from the bottom of the screen
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)', // Adjust for the button's width to keep it centered
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: '1000', // Ensure it stays on top of other elements
  }
};