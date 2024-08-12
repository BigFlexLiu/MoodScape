import { Button, Rows, Title, MultilineInput } from "@canva/app-ui-kit";
import { useState } from "react";
import styles from "styles/components.css";
import ImagePicker from "./imagepicker";

export const App = () => {
  const [description, setDescription] = useState("")
  const [imageurls, setImageurls] = useState<String[]>([])

  const getData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  }

  const onClick = async () => {
    console.log("clicked")
    try {
      const keywordsjson = await getData(`https://us-east5-imageexplorer-6587c.cloudfunctions.net/keywords?text=${description}`)
      const images = await getData(`https://us-east5-imageexplorer-6587c.cloudfunctions.net/images?text=${keywordsjson.keywords}`);

      setImageurls(images.map(item => item.src));
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (<div className={styles.scrollContainer}>
    <Rows spacing="2u">
      <Title>
        Enhance your moodboard
      </Title>
      <MultilineInput
        autoGrow
        minRows={3}
        onChange={(value) => setDescription(value)}
        placeholder="Describe what you envision"
      />
      <Button variant="primary" onClick={onClick} stretch>
        Find images
      </Button>
      {
        imageurls.length > 0 &&
        <div className={styles.scrollContainer}>
          <ImagePicker images={imageurls}></ImagePicker>
        </div>
      }
    </Rows>
  </div>)
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