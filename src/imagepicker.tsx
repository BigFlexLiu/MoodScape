import React, { useState } from 'react';

const ImagePicker = ({imageSelection, setImageSelection}) => {
    const imgs = [require("assets/images/cat.jpg"), require("assets/images/dog.jpg"), require("assets/images/rabbit.jpg"), require("assets/images/weather.png")]

    // Function to toggle image selection
    const toggleImageSelection = (index) => {
        if (imageSelection.includes(index)) {
            setImageSelection(imageSelection.filter((value) => value !== index))
        } else {
            setImageSelection([...imageSelection, index])
        }
    };

    return (
        <div style={styles.container}>
            {imgs.map((image, index) => (
                <div
                    key={index}
                    style={{
                        ...styles.imageContainer,
                        borderColor: imageSelection.includes(index) ? 'blue' : '#ccc',
                    }}
                    onClick={() => toggleImageSelection(index)}
                >
                    <img src={image} alt={`Image ${index+1}`} style={styles.image} />
                    {imageSelection.includes(index) && (
                        <div style={styles.checkmarkOverlay}>
                            ✓
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Basic styling for the container and images
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px', // Space between each image
    },
    imageContainer: {
        position: 'relative',
        border: '4px solid #ccc',
        borderRadius: '8px',
        padding: '5px',
        display: 'inline-block',
        cursor: 'pointer',
    },
    image: {
        display: 'block',
        width: '100%',
        height: 'auto',
    },
    checkmarkOverlay: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        borderRadius: '50%',
        padding: '4px',
        fontSize: '16px',
    },
};

export default ImagePicker;
