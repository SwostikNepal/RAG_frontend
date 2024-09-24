import React, { useState } from 'react';
import '../Input.css'; 
function Input() {
    const [file, setFile] = useState<File | null>(null); //first element is a variable and second is an updater function. 
    const [buttonText, setButtonText] = useState<string>('Upload');
    const [uploadMessage, setUploadMessage] = useState<string>('');

    //Function to listen to changes in the file upload.
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);//Takes the first file.
            setButtonText('Upload'); // Reset button text when a new file is selected
            setUploadMessage(''); // Clear previous upload message
        }
    };

    //Function to handle the form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); //prevents default behaviour of the form submission.
    
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
    
        //Create a new object and append it to store the file(pdf) and send to the server.
        const formData = new FormData();
        formData.append('file', file); 
    
        //Sends the file to the server via. backend api call. 
        try {
            const response = await fetch('http://127.0.0.1:8000/upload_pdf', {
                method: 'POST',
                body: formData,
            });
    
            // Log the entire response
            const responseData = await response.json(); //change the response to json.
            console.log('Response Data:', responseData);
    
    
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
            <div >
                <h1>Ask The PDF</h1>
                
                <input
                    type="file"                  
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
