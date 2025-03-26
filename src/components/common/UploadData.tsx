import { useState } from "react";
import axiosInstance from "../../api/AxiosConfig.ts";
import Swal from 'sweetalert2';

const UploadData: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const onUploadHandler = async () => {
        if (!selectedFile) {
            Swal.fire('Error', 'Please select a file first.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);
        try {
            const response = await axiosInstance.post('/ObjectCopy', formData);
            console.log(response);
            Swal.fire('Success', 'File uploaded successfully!', 'success');
        } catch (error) {
            console.error('File upload failed:', error);
            Swal.fire('Error', 'File upload failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upload Your File</h2>
                <input
                    type="file"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={onFileChangeHandler}
                />
                {selectedFile && <p className="text-green-600 mt-4">Selected File: {selectedFile.name}</p>}

                <button
                    onClick={onUploadHandler}
                    className="mt-4 w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Uploading...
            </span>
                    ) : (
                        'Upload File'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadData;
