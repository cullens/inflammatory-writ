'use strict';

var agent = require('thingjs-agent');

var lyrics = [

    //  Inflammatory Writ by Joanna Newsom

    'Oh, where is your inflammatory writ\n' +
    'Your text that would incite a light be lit\n' +
    'Our music deserving, devotion unswerving\n' +
    'Cry "Do I deserve her?" with unflagging fervor\n' +
    'Well, no we deny if we cannot get over it\n\n\n^5000',

    'And what\'s it mean when suddenly we\'re spent\n' +
    'And tell me true ambition came and reared its head and went far from you\n' +
    'Even mollusks have weddings, though solemn and leaden\n' +
    'But you dirge for the dead, and take no jam on your bread\n' +
    'Just a supper of salt and a waltz through your empty bed\n\n\n^5000',

    'And all at once it came to me\n' +
    'And I wrote and hunched \'till four-thirty\n' +
    'But that vestal light, it burns out with the night\n' +
    'In spite of all the time that we spent on it\n' +
    'On one bedraggled ghost of a sonnet\n' +
    'While outside, the wild boars root\n' +
    'Without bending a bough underfoot\n' +
    'Oh it breaks my heart, I don\'t know how they do it\n' +
    'So don\'t ask me\n\n\n^5000',

    'And as for my inflammatory writ\n' +
    'Well, I write it an I was not inflamed one bit\n' +
    'Advice from the master derailed that disaster\n' +
    'He said "Hand that pen over to me, poetaster!"\n' +
    'While across the great plains, keen and lovely and awful\n' +
    'Ululate the last Great American Novels\n' +
    'An unlawful lot, left to stutter and freeze, floodlit\n' +
    'But at least they didn\'t run, to their undying credit\n\n\n^5000'

];

agent(
    '@host test.thingjs.org',
    'abstract broker extends Mqtt'
);

agent('extends Heartbeat');

agent('extends broker', {

    setup: function(cb) {
        this.$super(cb);

        var i = 0;

        this.act = this.addBehaviour('inflammatory-writ extends Actuator');

        this.addBehaviour('extends Waker', '@period 4000', {

            wake: function($cb) {
                var now = new Date(),
                    timeStamp =     
                        this.$parent.toRoman(now.getHours()) + ' ' + 
                        this.$parent.toRoman(now.getMinutes()) + ' ' + 
                        this.$parent.toRoman(now.getSeconds()) 
                    ; 

                agent(this.$parent.act)
                    ('push', timeStamp + '\n' + lyrics[i])()
                    ;

                if (++i === lyrics.length) 
                    i = 0;

                this.reset();

                this.$super($cb);
            }

        });

    },

    toRoman: function(value) {
        var r = '',
            i = 3,
            digits = String(value).split(''),
            k = [   '','C','CC','CCC','CD','D','DC','DCC','DCCC','CM',
                    '','X','XX','XXX','XL','L','LX','LXX','LXXX','XC',
                    '','I','II','III','IV','V','VI','VII','VIII','IX'
            ]
            ;
            
        while (i--)
            r = (k[parseInt(digits.pop()) + (i * 10)] || '') + r;
        
        return new Array(parseInt(digits.join('') || '0') + 1)
            .join('M') + r
            ;
    }

});