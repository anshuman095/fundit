import { ICalCalendar } from 'ical-generator';
import fs from 'fs';
import path from 'path';
 

export async function createCalendar(arr) {
    // Create a new iCal calendar
    const cal = new ICalCalendar();

    // Add events to the calendar
    arr.forEach(obj => {
        console.log(obj);
        cal.createEvent({
            start: obj.planned_meeting_date_from,
            end: obj.planned_meeting_date_to,
            summary: obj.meeting_title || 'demo',
            description: obj.meeting_title,
            location: obj.venue
        });
    });

    const folderPath = './public/calendar';
    const fileName = `calendar.ics`;
    const filePath = path.join(folderPath, fileName);
    try {
        /** Check if file exists */ 
        await fs.promises.access(filePath);
        /** If exists, unlink the file */  
        await fs.promises.unlink(filePath);
    } catch (err) {
        /** Ignore error if file doesn't exist */  
        if (err.code !== 'ENOENT') {
            console.error('Error occurred while deleting the file:', err);
            // throw err;
        }
    }

    /** Generate the iCal data */  
    const iCalData = cal.toString();

    /** Save the iCal data to a file */ 
    try {
        await fs.promises.writeFile(filePath, iCalData, 'utf-8');
        console.log('iCalendar file generated successfully.');
        return { fileName, filePath };
    } catch (err) {
        console.error('Error occurred while writing iCalendar file:', err);
        // throw err;
    }
}

// function calendarFileFormat(userId) {
//     const date = new Date();
//     const month = date.getMonth();
//     const year = date.getFullYear();
//     const day = date.getDate();
//     return `calendar${year}${month}${day}${userId}.ics`;
// }
