const {objOf, merge, over, lensIndex} = require ('ramda')

const RecorderT = M => {
    const Recorder = run =>
    ({
        run,

        map: f => 
            Recorder (run.map (([a, w]) => [f(a), w])),

        chain: mf => 
            Recorder (run.chain (([a, w1]) => 
                mf (a).run.map (([b, w2]) => [b, merge (w1) (w2)]))),

        join: m => 
            Recorder (run.chain (([_, w1]) => 
                m.run.map (([b, w2]) => [b, merge (w1) (w2)]))),

        ap: ma => 
            Recorder (run.chain (([f, w1]) => 
                ma.run.map (([b, w2]) => [f(b), merge (w1) (w2)])))

    })

    Recorder.lift = m => Recorder(m.map (x => [x, {}]))

    Recorder.say = (k, v) => Recorder(M.of([null, objOf(k, v)]))
    Recorder.sayKey = k => v => Recorder(M.of([null, objOf(k, v)]))
    Recorder.sayValue = v => k => Recorder(M.of([null, objOf(k, v)]))

    Recorder.of = x => Recorder(M.of([x, {}]))

    return Recorder
}

module.exports = RecorderT

