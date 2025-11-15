document.addEventListener('DOMContentLoaded', () => {
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('fileInput');
    const statusText = document.getElementById('status-text');
    const cancelBtn = document.querySelector('.cancel-btn');
    const attachBtn = document.querySelector('.attach-btn');

    const MAX_SIZE_MB = 5;

    // Helper function to check file size
    function validateFileSize(files){
        for (let file of files){
            if (file.size > MAX_SIZE_MB * 1024 * 1024){
                alert(`"${file.name}" is too large. Max ${MAX_SIZE_MB} is allowed.`);
                return false;
            }
        }
        return true;
    }

    // Open file dialog
    uploadBox.addEventListener('click', () => fileInput.click());

    // File selected via dialog
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            statusText.textContent = `${fileInput.files.length} File(s) Added.`;
        }
    });

    // Drag Over
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });

    // Drag Leave
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
    });

    // Drop files
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            statusText.textContent = `${files.length} File(s) Added.`;
        }
    });

    // Cancel Button
    cancelBtn.addEventListener('click', () => {
        fileInput.value = '';
        statusText.textContent = '';
    });

    // Attach Button
    attachBtn.addEventListener('click', async () => {
        if (fileInput.files.length === 0) {
            alert('Please select a PDF file first.');
            return;
        }

        if (!validateFileSize(fileInput.files)) return;

        // Show uploading message
        statusText.textContent = `Uploading ${fileInput.files.length} file(s)...`;

        // Create FormData here
        const formData = new FormData();
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('files[]', fileInput.files[i]);
        }

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });

            // Ensure JSON parsing is safe
            let data;
            try{
                data = await response.json();
            } catch(e){
                throw new Error('Invalid JSON response from server.');
            }

            if (data.success) {
                // Save JSON formatted questions & answers to localStorage
                localStorage.setItem('quizQuestions', JSON.stringify(data.questions));

                if (fileInput.files.length > 0) {
                    localStorage.setItem("lastUploadedFile", fileInput.files[0].name);
                }


                statusText.textContent = 'Upload complete! Redirecting...';

                // Redirect after a short delay to show user the status
                setTimeout(() => {
                    // Backend confirms questions are generated
                    window.location.href = 'map.html';
                }, 3000);
            } else {
                alert('Error processing file. Try again.');
                statusText.textContent = '';
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed. Check console.');
            statusText.textContent = '';
        }
    });
});
