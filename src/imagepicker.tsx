import React, { useState } from 'react';
import { addNativeElement } from "@canva/design";
import { upload } from "@canva/asset";

const ImagePicker = ({ images }) => {
    const addImage = async (imageurl) => {
        const result = await upload({
            type: "IMAGE",
            mimeType: "image/jpeg",
            url: imageurl,
            thumbnailUrl: imageurl,
        });
        await addNativeElement({
            type: "IMAGE",
            ref: result.ref,
        });
    }

    return (
        <div style={styles.container}>
            {images.map((image, index) => (
                <div
                    key={index}
                    style={{
                        ...styles.imageContainer,
                        borderColor: '#ccc',
                    }}
                    onClick={() => {
                        addImage(image)
                    }}
                >
                    <img src={image} alt={`Image ${index + 1}`} style={styles.image} />
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
