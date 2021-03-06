import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { merge } from 'ramda'

const moment = extendMoment(Moment)

// const history = [
//   { _id: "1518086701", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518176701", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518259641", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518432441", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518605241", text: "00:30:00", actor: 'bot', timer: true },
//   { _id: "1518691641", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518778041", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518864441", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1518950841", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519037241", text: "00:35:00", actor: 'bot', timer: true },
//   { _id: "1519123641", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519210041", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519382841", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519469241", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519555641", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519642041", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1519728441", text: "00:25:00", actor: 'bot', timer: true },
//   { _id: "1519814841", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1520074041", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1520160441", text: "00:20:30", actor: 'bot', timer: true },
//   { _id: "1520333241", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1520419641", text: "00:20:00", actor: 'bot', timer: true },
//   { _id: "1520506041", text: "00:15:30", actor: 'bot', timer: true },
//   { _id: "1520592441", text: "00:20:00", actor: 'bot', timer: true }
// ]

export default (formattedDuration, db) => {
  return db.allDocs({include_docs: true})
    .then(docs => {
      const times = docs.rows
        .filter(({doc}) => doc.timer)
        .map(({doc}) => merge(doc, {seconds: moment.duration(doc.text).asSeconds()}))
        .reduce((chart, doc) => {
          const date = moment.unix(doc._id).format('YYYY-MM-DD').toString()

          chart.longest = doc.seconds > chart.longest ? doc.seconds : chart.longest
          chart.from = chart.from || date
          chart.to = date
          chart.data[date] = doc.seconds
          chart.total = chart.total + doc.seconds

          return chart
        }, {longest: 0, data: {}, total: 0})

      const { from, to, total } = times

      const range = moment.range(from, to)

      const chart = Array.from(range.by('days'))
        .map(day => {
          const date = day.format('YYYY-MM-DD').toString()
          const seconds = times.data[date] || 0
          const time = Math.round(seconds / times.longest * 100)
          return { date, time }
        })
console.log({ _id: moment().unix().toString(), chart, total, from, to, last: formattedDuration })
      return { _id: moment().unix().toString(), chart, total, from, to, last: formattedDuration }
    })
    .catch(err => console.error(err))
}
