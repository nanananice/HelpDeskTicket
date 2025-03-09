/**
 * Returns the appropriate color for a ticket status
 * @param {string|number} status - Status name or ID
 * @returns {string} Hex color code
 */
export const getStatusColor = (status) => {
    // Handle both status name (string) and status ID (number)
    if (typeof status === 'string') {
        switch(status) {
            case 'PENDING': return '#FFA500'; // Orange
            case 'ACCEPTED': return '#0066cc'; // Blue
            case 'RESOLVED': return '#008000'; // Green
            case 'REJECTED': return '#FF0000'; // Red
            default: return '#808080'; // Gray as fallback
        }
    } else if (typeof status === 'number' || !isNaN(parseInt(status))) {
        const statusId = parseInt(status);
        switch(statusId) {
            case 1: return '#FFA500'; // Orange - PENDING
            case 2: return '#0066cc'; // Blue - ACCEPTED
            case 3: return '#008000'; // Green - RESOLVED
            case 4: return '#FF0000'; // Red - REJECTED
            default: return '#808080'; // Gray as fallback
        }
    }
    return '#808080'; // Default gray
};

// Status mapping between name and ID
export const STATUS_MAP = {
    'PENDING': 1,
    'ACCEPTED': 2,
    'RESOLVED': 3,
    'REJECTED': 4
};
