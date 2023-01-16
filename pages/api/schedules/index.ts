import { NextApiRequest, NextApiResponse} from 'next';
// import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '@/dbconnect/db';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if(req.method === 'GET'){
        const schedules = await prisma.schedule.findMany();
        // console.log(schedules);
        return res.send(schedules);
    }else if(req.method === 'POST'){
        // console.log(req.body)
        const {
            eventId,
            summary,
            location,
            description,
            start,
            end,
            hangoutLink,
            htmlLink
        } = req.body
        const newSchedule = await prisma.schedule.create({
            data: {
                eventId: eventId,
                summary: summary,
                location: location,
                description: description,
                start: start.dateTime,
                end: end.dateTime,
                hangoutLink: hangoutLink,
                htmlLink: htmlLink
            }
        });
        return res.status(201).send(newSchedule);
    }
}