import React, { useState } from 'react';

function MessageBox() {
    const [message, setMessage] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!message) {
            alert("Please enter a question.");
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message }),  // Wrap message in an object
            });
      
            const data = await response.json();
            setAnswer(data.answer);
            setError('');
        } catch (error) {
            console.error('Error querying document:', error);
            setError('Error querying document.');
            setAnswer('');
        }
    }; 
    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="messageInput"><h2>Ask your question</h2></label>
                    <textarea
                        id="messageInput"
                        className="form-control"
                        rows={4}
                        value={message}
                        onChange={handleChange}
                        placeholder="Type your question here..."
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
            </form>

            {answer && (
                <div className="answer-box mt-3">
                    <h4>Answer:</h4>
                    <p>{answer}</p>
                </div>
            )}
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
}

export default MessageBox;
