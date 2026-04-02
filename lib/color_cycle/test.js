import { color_cycle } from './color_cycle.js';

const conf =  color_cycle.parse_conf();

//const i = color_cycle.get_index(conf, 0, new Date() );
//console.log(i)

//const status = color_cycle.get_status(conf, new Date() );
//console.log(status);


const get_ansi_string = (conf, now = new Date() ) => {
    const ansi = { R: 31, G: 32, B: 34, O: 33, Y: 93, W: 39 }
    const status = color_cycle.get_status( conf, now );
    const colorObj = conf.array[ status.i_array ];
    const str_disc = status.disc.map( (disc) => {
        const color_d = colorObj.data[ disc[1] ];
        return '\u001b[' + ansi[ color_d.short ] + 'm' + color_d.desc + '\u001b[' + ansi.W + 'm tags are now ' + disc[0] + '% off';
    }).join(', ');
    
    const color_p = colorObj.data[ status.i_print ];
    const color_c = colorObj.data[ status.i_cull ];
    const str = 'We are printing new color tags in \u001b[' + ansi[ color_p.short ] + 'm' + color_p.desc + '\u001b[' + ansi.W + 'm. ' +
        'Color discounts are now the following... ' + str_disc + '. ' +
        'Please cull or reprice any \u001b[' + ansi[ color_c.short ] + 'm' + color_c.desc + '\u001b[' + ansi.W + 'm tags.'
    return str;  
};

console.log( get_ansi_string( conf, new Date() ) );
