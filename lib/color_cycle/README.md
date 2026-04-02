# color_cycle

The goal here is to have a well designed color cycle library to help provide and important feature of the data2 pricing system.


## Making a human readable color status string

```js
const get_string = (conf, now = new Date()) => {
    const status = color_cycle.get_status( conf, now );
    const colorObj = conf.array[ status.i_array ];
    const str_disc = status.disc.map( (disc) => { 
        return colorObj.data[ disc[1] ].desc + ' tags are now ' + disc[0] + '% off';
    }).join(', ');
    const str = 'We are printing new color tags in ' + colorObj.data[ status.i_print ].desc + '. ' +
       'Color discounts are now the following... ' + str_disc + '. ' +
       'Please cull or reprice any ' + colorObj.data[ status.i_cull ].desc + ' tags. ';
    return str;
    
};
```

### ANSI escape codes for command line interface

If the aim is to make a human readable status string to use in a CLI application then I would want to use [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) as a way to style the text. 

```
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
```

