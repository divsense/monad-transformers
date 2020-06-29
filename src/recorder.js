const {objOf, merge, over, lensIndex} = require ('ramda')

const Recorder = run =>
({
    run,
        
    map: f => Recorder (over (lensIndex(0)) (f) (run)),

    ap: ma => {
        const [f, w1] = run
        const [b, w2] = ma.run
        return Recorder ([f(b), merge (w1) (w2)])
    },

    chain: f => {
        const [a, w1] = run
        const [b, w2] = f(a).run
        return Recorder ([b, merge (w1) (w2)])
    },

    join: other => {
        const [_, w1] = run
        const [b, w2] = other.run
        return Recorder ([b, merge (w1) (w2)])
    }

})

Recorder.say = (k, v) => Recorder([null, objOf(k, v)])
Recorder.sayKey = k => v => Recorder([null, objOf(k, v)])
Recorder.sayValue = v => k => Recorder([null, objOf(k, v)])

Recorder.of = x => Recorder([x, {}])

module.exports = Recorder

