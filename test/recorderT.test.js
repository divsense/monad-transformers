const test = require ('ava')

const Either = require ('../src/either.js')
const RecorderT = require ('../src/recorderT.js')
const TaskT = require ('../src/taskT.js')
const {Left, Right} = Either

test ('RecorderT, map', t => {

    t.plan (1)

    const Transformer = RecorderT (Either)

    const x = Transformer.of (1).map (x => x + 3)

    x.run.fold (
        e => t.fail(),
        r => t.deepEqual (r, [4, {}])
    )

})

test ('RecorderT, chain', t => {

    t.plan (1)

    const TaskEither = TaskT (Either)
    const Transformer = RecorderT (TaskEither)

    const x = Transformer.say ('a', "hello, ")
                .join (Transformer.lift (TaskEither.lift (Right ("world!"))))
                .chain (Transformer.sayKey ('b'))

    x.run.fork (
        rej => t.fail(),
        res => res.fold (
            e => t.fail(),
            r => t.deepEqual (r[1], {a: 'hello, ', b: 'world!'})
        )
    )

})

test ('RecorderT, ap', t => {

    t.plan (1)

    const TaskEither = TaskT (Either)
    const Transformer = RecorderT (TaskEither)

    const x = Transformer.say ('a', "hello")
                .join (Transformer.of (x => ", " + x))
                .ap (Transformer.of ("world!"))
                .chain (Transformer.sayKey ('b'))

    x.run.fork (
        rej => t.fail(),
        res => res.fold (
            e => t.fail(),
            r => t.deepEqual (r[1], {a: 'hello', b: ', world!'})
        )
    )

})
