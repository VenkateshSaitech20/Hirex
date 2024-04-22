export const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    
    // Define months array
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get day, month, and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Get hours, minutes, and AM/PM
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ?? 12; // Handle midnight (0:00) as 12 AM

    // Format the result
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};