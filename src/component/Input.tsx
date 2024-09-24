import React, { useState } from 'react';
import '../Input.css'; 
function Input() {
    const [file, setFile] = useState<File | null>(null);
    const [buttonText, setButtonText] = useState<string>('Upload');
    const [uploadMessage, setUploadMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setButtonText('Upload'); // Reset button text when a new file is selected
            setUploadMessage(''); // Clear previous upload message
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/upload_pdf', {
                method: 'POST',
                body: formData,
            });
    
            // Log the entire response
            const responseData = await response.json();
            console.log('Response Data:', responseData);
    
            if (!response.ok) {
                throw new Error(responseData.detail || 'Network response was not ok');
            }
    
            setUploadMessage(responseData.message); // Show upload success message
            setButtonText('Uploaded'); // Change button text on successful upload
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error uploading file:', errorMessage);
            setUploadMessage(`Error uploading file: ${errorMessage}`);
            setButtonText('Upload'); // Reset to original text on error
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="exampleFormControlFile1"><h1>Ask The PDF</h1></label>
                <br></br>
                <input
                    type="file"
                    className="form-control-file"
                    id="exampleFormControlFile1"
                    accept=".pdf"
                    onChange={handleFileChange}
                />
            </div>
            <br></br>
            <button type="submit" className="btn btn-primary">
                {buttonText}
            </button>
            {uploadMessage && <p>{uploadMessage}</p>}
        </form>
    );
}

export default Input;
