import {AlertConfig} from "../../types/entities.ts";
import {useEffect, useState} from "react";
import axiosInstance from "../../api/AxiosConfig.ts";
import Swal from "sweetalert2";

const AlertConfigForm: React.FC = () => {
    const [alertRate, setAlertRate] = useState<AlertConfig>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [percentage, setPercentage] = useState<number>(0);

    useEffect(() => {
        const fetchAlertConfig = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/AlertConfig");
                if (response.data) {
                    setAlertRate(response.data);
                    setPercentage(response.data.percentage);
                }
            } catch (err) {
                setError('Failed to load AlertConfig data');
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load AlertConfig data',
                });
            } finally {
                setLoading(false);

            }
        }
        fetchAlertConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!alertRate) return;

        // Validate percentage input
        if (isNaN(percentage)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter a valid number for percentage',
            });
            return;
        }

        // Create updated AlertConfig object
        const updatedConfig: AlertConfig = {
            ...alertRate,
            percentage: percentage,
            dateUpdated: new Date(), // Update the dateUpdated field
        };

        try {
            await axiosInstance.post('/AlertConfig/Update', updatedConfig);

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Alert configuration has been updated successfully',
            });

            // Update local state
            setAlertRate(updatedConfig);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update AlertConfig',
            });
        }
    };

    if (loading) {
        return <div className="p-4">Loading alert configuration...</div>;
    }

    if (error || !alertRate) {
        return <div className="p-4 text-red-500">{error || 'Error loading data'}</div>;
    }

    // @ts-ignore
    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Update Alert Configuration</h1>

            <div className="mb-4">
                <p><span className="font-semibold">Date Added:</span> {new Date(alertRate.dateAdded).toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })}</p>
                <p><span className="font-semibold">Last Updated:</span> {new Date(alertRate.dateUpdated).toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })}</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="percentage" className="block font-medium mb-1">
                        Percentage:
                    </label>
                    <input
                        type="number"
                        id="percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Update Configuration
                </button>
            </form>
        </div>
    );
}

export default AlertConfigForm;