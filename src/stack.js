const {take, isNil, over, lensIndex, head, drop, prepend} = require ('ramda')

const Stack = run => ({
    run,

    chain: f => Stack(x => { const [y, s] = run(x); return f(y).run(s) }),

    join: y => Stack(x => { const [_, s] = run(x); return y.run(s) }),

    ap: a => Stack(x => { const [f, s] = run(x); return a.map(f).run(s) }),

    map: f => Stack(x => { const [y, s] = run(x); return [f(y), s] }),

    concat: other =>
        Stack(x => {
            const [y, s] = run(x);
            const [y1, _s1] = other.run(x);

            return [y.concat(y1), s];
        }),

    zip: sm => Stack (x => {
        const [a, s] = run (x)
        const [b]    = sm.run (x)

        return [[a, b], s]
    }),

    zip2: sm1 => sm2 => Stack (x => {
        const [a, s] = run (x)
        const [b]    = sm1.run (x)
        const [c]    = sm2.run (x)

        return [[a, b, c], s]
    }),

    zip3: sm1 => sm2 => sm3 => Stack (x => {
        const [a, s] = run (x)
        const [b]    = sm1.run (x)
        const [c]    = sm2.run (x)
        const [d]    = sm3.run (x)

        return [[a, b, c, d], s]
    })
});


Stack.of = x => Stack (s => [x, s])
Stack.peek = cnt => Stack (s => {
    const xs = cnt == -1 ? s : isNil (cnt) ? head (s) : take (cnt, s)
    return [xs, s]
})
Stack.top = f => Stack (s => [null, over (lensIndex(0), f, s)])
Stack.pop = Stack (s => [head (s), drop (1, s)])
Stack.push = x => Stack (s => [null, prepend (x, s)])

module.exports = Stack

