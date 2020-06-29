const test = require ('ava')

const Recorder = require ('../src/recorder.js')

test ('Recorder, map', t => {

    t.plan (2)

    const x = Recorder.of (1).map (x => x + 3)

    const [a, res] = x.run
    t.is (a, 4)
    t.deepEqual (res, {})

})

test ('Recorder, chain', t => {

    t.plan (1)

    const x = Recorder.of (1)
                    .chain (Recorder.sayKey ('a'))
                    .join (Recorder.say ('b', 2))

    const [_, res] = x.run
    t.deepEqual (res, {a: 1, b: 2})

})

test ('Recorder, ap', t => {

    t.plan (1)

    const x = Recorder.say ('a', 1)
                    .join (Recorder.of (x => x * 2))
                    .ap (Recorder.of (5))
                    .chain (Recorder.sayKey ('b'))

    const [_, res] = x.run
    t.deepEqual (res, {a: 1, b: 10})

})

