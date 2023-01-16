import Head from 'next/head'
import { FormEventHandler } from 'react'
import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Calendar from '../components/calendar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Home.module.scss'
import dayjs from 'dayjs'
import Axios from 'axios'
const Home = () => {
  const [startDate, setStartDate] = useState<any>('');
  const [isUpdate, setUpdate] = useState(false);
  const [endDate, setEndDate] = useState<any>('');
  const [schedules, setSchedules] = useState([])
  const [calendar, setCalendar] = useState({
    'id': '',
    'summary': '',
    'location': '',
    'description': '',
    'start': {
      dateTime: '',
      timezone: 'Asia/Manila'
    },
    'end': {
      dateTime: '',
      timezone: 'Asia/Manila'
    },
    requestId: ''
  })
  const session = useSession()
  const calendarID = 'aureliovasquez041553@gmail.com';
  const apiKey = '6576293325-ksh69mlndna72tpjvkeo1hh4b2sqrs2q.apps.googleusercontent.com';
  const accessToken = 'AIzaSyB_pIs4qDlLUrOCaJHYZMMMUnL6Vb1_C7g';
  // console.log(session)
  const handleSubmit:FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    return await signIn()
  }
  const stringGen = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  const getEvents = async () => {
    await Axios({
        method: 'GET',
        url: '/api/schedules',
    }).then((res) => {
        const data = res.data;
        const newEvents = data.map((event: any) => event && {
         ...event,
         title: event.summary 
        })
        console.log(newEvents);
        setSchedules(newEvents)
        // console.log(data);
    })
    // const gapi = await import('gapi-script').then((pack) => pack.gapi);
    // gapi.load('client:auth2', () => {
    //   console.log('load client')
    //   gapi.client.init({
    //     apiKey: accessToken,
    //     clientId: apiKey,
    //     discoverDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    //     scope: "https://www.googleapis.com/auth/calendar.events"
    //   })
    //   gapi.client.load('calendar', 'v3', () => console.log('boom'))
    //   gapi.auth2.getAuthInstance().signIn().then(() => {
    //     gapi.client.calendar.events.list({
    //       'calendarId': 'vasquezjp14@gmail.com',
    //       'timeMin': (new Date()).toISOString(),
    //       'showDeleted': false,
    //       'singleEvents': true,
    //       'maxResults': 10,
    //       'orderBy': 'startTime'
    //     }).then((response: any) => {
    //       const events = response.result.items
    //       console.log('EVENTS: ',events)
    //       const newEvents = events.map((event: any) => event && {
    //         'title': event.summary,
    //         'start': event.start.dateTime,
    //         'end': event.end.dateTime,
    //         'color': '#33b679',
    //         'backgroundColor': '#33b679',
    //         'textColor': '#fff',
    //       })
    //       setSchedules(newEvents)
    //       console.log(newEvents)
    //     })
    //   })
    // })
  }
  useEffect(() => {
    getEvents();
    return () => {
        setUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate]);

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setCalendar({ ...calendar, [name]: value })
  }

  const handleCalendarSubmit = async (e: any) => {
    e.preventDefault()
    // console.log(dayjs(startDate).format('YYYY-MM-DDTHH:mm:ssZ'))
    // console.log(endDate)
    // console.log(calendar)
    const gapi = await import('gapi-script').then((pack) => pack.gapi);
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: accessToken,
        clientId: apiKey,
        discoverDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.events"
      })
      gapi.client.load('calendar', 'v3')
      gapi.auth2.getAuthInstance().signIn().then(() => {
        let events = {
          'summary': calendar.summary,
          'location': calendar.location,
          'description': calendar.description,
          'start': {
            'dateTime': dayjs(startDate).format('YYYY-MM-DDTHH:mm:ssZ'),
            'timeZone': 'Asia/Manila'
          },
          'end': {
            'dateTime': dayjs(endDate).format('YYYY-MM-DDTHH:mm:ssZ'),
            'timeZone': 'Asia/Manila'
          },
          'colorId': 2,
          // 'recurrence': [
          //   'RRULE:FREQ=DAILY;COUNT=1'
          // ],
          // 'attendees': [
          //   {'email': 'vasquezjp14@gmail.com'},
          //   {'email': 'jvasquez@stratpoint.com'}
          // ],
          'conferenceData': {
            createRequest: {
              requestId: stringGen(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        };
        let request = gapi.client.calendar.events.insert({
          'calendarId': 'vasquezjp14@gmail.com',
          'conferenceDataVersion': 1,
          'resource': events
        })

        request.execute(async (event: any) => {
            // window.open(event.htmlLink)
            console.log('event');
            console.log(event);
            const newEvents = {
              ...events,
              eventId: event.id,
              hangoutLink: event.hangoutLink,
              htmlLink: event.htmlLink
            }
            console.log(newEvents);
            await Axios({
                method: 'POST',
                url: '/api/schedules',
                data: newEvents
            }).then((success) => {
              console.log('success')
              console.log(success)
            }).catch((error) => {
                const { data } = error.response
                console.log(data)
            })
          }
        )
      });
    })
  }
  const filterStartPassedTime = (time: any) => {
    const currentDate = startDate ? startDate : new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const filterEndPassedTime = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const handleCalendarUpdate = async () => {
    const gapi = await import('gapi-script').then((pack) => pack.gapi);
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: accessToken,
        clientId: apiKey,
        discoverDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.events"
      })
      gapi.client.load('calendar', 'v3')
      gapi.auth2.getAuthInstance().signIn().then(() => {
        let events = {
          'summary': 'Title 1',
          'location': 'Location 1',
          'description': 'desc1',
          'colorId': 2,
          'start': {
            'dateTime': dayjs('2023-01-09 06:00:00.000').format('YYYY-MM-DDTHH:mm:ssZ'),
            'timeZone': 'Asia/Manila'
          },
          'end': {
            'dateTime': dayjs('2023-01-09 07:00:00.000').format('YYYY-MM-DDTHH:mm:ssZ'),
            'timeZone': 'Asia/Manila'
          },
          'attendees': [
            {'email': 'vasquezjp14@gmail.com'},
            {'email': 'jvasquez@stratpoint.com'}
          ],
          'conferenceData': {
            createRequest: {
              requestId: stringGen(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          }
        };
        let request = gapi.client.calendar.events.update({
          'calendarId': 'vasquezjp14@gmail.com',
          'conferenceDataVersion': 1,
          'eventId': 's1ue9c09l62h910k8um5scnehk',
          'resource': events
        })

        request.execute(async (event: any) => {
            console.log(event);
            window.open(event.htmlLink)
          }
        )
      });
    })
  }
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.leftWrapper}>
        <form onSubmit={handleSubmit}>
          <button type='submit'>Login</button>
          {/* <button type='button' onClick={addEvent}>Add Event</button> */}
          <button type='button' onClick={getEvents}>List Events</button>
          <button type='button' onClick={handleCalendarUpdate}>Update Event</button>
        </form>
        <div className={styles.addEventForm}>
          <form onSubmit={handleCalendarSubmit}>
            <div className={styles.inputWrapper}>
              <label>Title</label>
              <input name='summary' type='text' onChange={handleChange} value={calendar.summary || ''} />
            </div>
            <div className={styles.inputWrapper}>
              <label>Location</label>
              <input name='location' type='text' onChange={handleChange} value={calendar.location || ''} />
            </div>
            <div className={styles.inputWrapper}>
              <label>Description</label>
              <textarea name='description' onChange={handleChange} value={calendar.description} />
            </div>
            <div className={styles.inputWrapper}>
              <label>Start Date & Time:</label>
              <DatePicker
                selected={startDate}
                dateFormat="MMMM d, yyyy hh:mm aa"
                showTimeSelect
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                maxDate={new Date(endDate)}
                minTime={new Date()}
                maxTime={new Date(endDate)}
                filterTime={filterEndPassedTime}
                shouldCloseOnSelect={true}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label>End Date & Time:</label>
              <DatePicker
                selected={endDate}
                dateFormat="MMMM d, yyyy hh:mm aa"
                showTimeSelect
                onChange={(date) => setEndDate(date)}
                filterTime={filterStartPassedTime}
                minDate={startDate ? new Date(startDate) : new Date()}
                shouldCloseOnSelect={true}
                disabled={!startDate}
              />
            </div>
            <button type='submit'>Add Event</button>
          </form>
        </div>
      </div>
      <div className={styles.rightWrapper}>
        <div className={styles.calendarWrapper}>
          <Calendar events={schedules} />
        </div>
      </div>
    </div>
  )
}
export default Home;